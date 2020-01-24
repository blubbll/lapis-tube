

//© 2019 by blubbll
("use strict");
///////////////////////////////////////////////////////////////////////////
//DEPLOY
///////////////////////////////////////////////////////////////////////////
(async () => {
  const script = "!.glitch-deploy.js";
  if (process.env.PROJECT_DOMAIN) {
    const deployfile = ":deploying:";
    require("download")(
      "https://raw.githubusercontent.com/blubbll/glitch-deploy/master/glitch-deploy.js",
      __dirname,
      {
        filename: script
      }
    ).then(() => {
      deployProcess();
    });
    const deployProcess = async () => {
      const deploy = require(`./${script}`);
      const deployCheck = async () => {
        //console.log("🐢Checking if we can deploy...");
        if (fs.existsSync(`${__dirname}/${deployfile}`)) {
          console.log("🐢💥Deploying triggered via file.");
          fs.unlinkSync(deployfile);
          await deploy({
            ftp: {
              password: process.env.DEPLOY_PASS,
              user: process.env.DEPLOY_USER,
              host: process.env.DEPLOY_HOST
            },
            clear: 0,
            verbose: 1,
            env: 1
          });
          request(
            `https://evennode-reboot.glitch.me/reboot/${process.env.DEPLOY_TOKEN}/${process.env.PROJECT_DOMAIN}`,
            (error, response, body) => {
              console.log(error || body);
            }
          );
          require("child_process").exec("refresh");
        } else setTimeout(deployCheck, 9999); //10s
      };
      setTimeout(deployCheck, 999); //1s
    };
  } else require(`./${script}`)({ env: true }); //apply env on deployed server
})();

// init project
const express = require("express"),
  app = express(),
  fs = require("fs"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  request = require("request"),
  sass = require("node-sass"),
  es6tr = require("es6-transpiler"),
  regionParser = require("accept-language-parser");

const transpile = (file, direct) => {
  const result = es6tr.run({ filename: file });
  const ext = ".es5";
  const outFile = `${file.replace("/build", "/public")}`;

  if (result.src) {
    const betterResult = `//💜//i love you monad\r\n${result.src.replace(
      /\0/gi,
      ""
    )}`;
    if (!direct)
      [
        fs.writeFileSync(outFile, betterResult),
        console.log(`Transpiled ${file} to ${outFile}!`)
      ];
    else {
      //console.log(`Transpiled ${file}!`);
      return betterResult;
    }
  } else console.warn(`Error at transpiling of file ${file}:`, result);
};

//BUILD
if (process.env.PROJECT_NAME) {
  //BUNDLE JS
  {
    const bundleFile = `${__dirname}/public/bundle.js`;
    let bundle = "";

    const scripts = [
      `${__dirname}/build/js/_SEARCH.js`,
      `${__dirname}/build/js/tools.js`,
      `${__dirname}/build/js/bg.js`,
      `${__dirname}/build/js/client.js`
    ];
    for (const script of scripts) {
      bundle += transpile(script, true);
    }
    //write bundle
    fs.writeFileSync(bundleFile, bundle, "utf8");
    console.log(`Bundled ${scripts} into ${bundleFile}!`);
  }

  //SASS
  {
    /*const c = {
      in: `${__dirname}/build/style.sass.css`,
      out: `${__dirname}/public/style.css`
    };
    fs.writeFileSync(
      c.out,
      sass
        .renderSync({
          data: fs.readFileSync(c.in, "utf8")
        })
        .css.toString("utf8")
    );*/

    const bundleFile = `${__dirname}/public/bundle.css`;
    let bundle = "";

    const styles = [
      `${__dirname}/build/css/lib/bs-shards.css`,
      `${__dirname}/build/css/style.sass.css`
    ];
    for (const style of styles) {
      bundle += sass.renderSync({
        data: fs.readFileSync(style, "utf8")
      }).css.toString("utf8");
    }
    //write bundle
    fs.writeFileSync(bundleFile, bundle, "utf8");
    console.log(`Bundled ${styles} into ${bundleFile}!`);
  }
}

//API
const API = "/api";

//calculate language based on accept-language header
const getLanguage = header => {
  return (header
    ? regionParser.parse(header)[0]
      ? regionParser.parse(header)[0].code
      : header
    : "EN"
  ).toLowerCase();
};

//get da ip
app.set("trust proxy", true);

//CORZ
app.use("*", (req, res, next) => {
  if (
    req.originalUrl === "/app.html" ||
    req.originalUrl.startsWith("/api/") ||
    req.originalUrl.startsWith("/html/")
  ) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
  }
  next();
});

// static
app.use(express.static("public"));

// base html
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/build/index.html`);
});

//HTML-Templates
app.get("/html/*", (req, res) => {
  res.sendFile(`${__dirname}${req.originalUrl}`);
});

//simple geo ip
app.get(`${API}/geoip`, (req, res) => {
  request(`http://api.petabyet.com/geoip/${req.ip}`).pipe(res);
});

//SEARCH
app.get(`${API}/:region/search/:q`, (req, res) => {
  //const L = getLanguage(req.headers["accept-language"]);

  console.warn(
    encodeURI(
      `https://${process.env.IV_HOST}/api/v1/search/?region=${req.params.region}&q=${req.params.q}`
    )
  );

  request({
    uri: encodeURI(
      `https://${process.env.IV_HOST}/api/v1/search/?region=${req.params.region}&q=${req.params.q}`
    ),
    method: "GET",
    timeout: 3000,
    followRedirect: true,
    maxRedirects: 10
  }).pipe(res);
  /*async (error, response, body) => {
      console.log(body);
      if (!error && body) {
        console.log(body);
      } else console.warn(response);
    }*/
});

//COMPLETE
app.get(`${API}/:region/complete/:q`, (req, res) => {
  //const language = getLanguage(req.headers["accept-language"]);
  const empty = "No results found...";
  const url = `https://suggestqueries.google.com/complete/search?client=youtube&cp=1&ds=yt&q=${req.params.q}&hl=${req.params.region}&format=5&alt=json&callback=?`;
  request(
    {
      uri: url,
      method: "GET",
      timeout: 3000,
      followRedirect: true,
      maxRedirects: 10,
      encoding: "latin1"
    },
    async (error, response, body) => {
      //console.warn(response);
      if (body) {
        let suggs = [];
        //console.log(body)
        const any = !body.includes('",[],{"k"');

        if (any) {
          const raw = body
            .split(`window.google.ac.h(["${req.params.q}",[[`)[1]
            .split("]]]")[0] //trim end
            .split(","); //into arr
          raw.length--; //remove last char

          Array.prototype.forEach.call(raw, (val, key) => {
            if (val !== "0]" && val.length) {
              //reached da end
              if (val.slice(1) === "]]" || val.startsWith("{")) return;
              if (!val.slice(1).endsWith("]]") && val.slice(1).length > 1)
                suggs.push(
                  val
                    .slice(key === 0 ? 1 : 2, -1)
                    .replace(/\\u([0-9a-fA-F]{4})/g, (m, cc) =>
                      String.fromCharCode("0x" + cc)
                    )
                );
            }
          });
        }

        suggs.length
          ? res.json({ code: 200, data: suggs })
          : res.json({ code: 404, msg: empty });
      }
    }
  );
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

const restartHours = 6;
setTimeout(function() {
  process.on("exit", function() {
    require("child_process").spawn(process.argv.shift(), process.argv, {
      cwd: process.cwd(),
      detached: true,
      stdio: "inherit"
    });
  });
  process.exit();
}, 1000 * 60 * 60 * restartHours); //restart every 6 hours
