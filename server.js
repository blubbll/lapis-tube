//© 2019-20 by blubbll
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
  regionParser = require("accept-language-parser"),
  Terser = require("terser"),
  crush = require("html-crush").crush,
  fetch = require("node-fetch");

/*let PROXY;
const getProxy = () => {
  fetch(process.env.REMOTE_INSTANCES)
    .then(res => res.json())
    .then(json => {
      console.log(json);
      //for(const prx of json)
    });
};

getProxy();
*/
{
  //BUILD
  if (process.env.PROJECT_NAME) {
    const dist = "/!dist";
    !fs.existsSync(`${__dirname}/${dist}`) &&
      fs.mkdirSync(`${__dirname}/${dist}`);
    !fs.existsSync(`${__dirname}/${dist}/html`) &&
      fs.mkdirSync(`${__dirname}/${dist}/html`);

    const atto = "/*!💜I love you monad.*/";
    const transpile = (file, direct) => {
      const result = es6tr.run({ filename: file });
      const outFile = `${file.replace("/build", dist)}`;

      if (result.src) {
        const outResult = result.src.replace(/\0/gi, "").replace(/\\r\n/gi, "");

        if (!direct)
          [
            fs.writeFileSync(outFile, `${atto}\r\n${outResult}`),
            console.log(`Transpiled ${file} to ${outFile}!`)
          ];
        else {
          //console.log(`Transpiled ${file}!`);
          return outResult;
        }
      } else console.warn(`Error at transpiling of file ${file}:`, result);
    };

    //HTML
    let building = false;
    const COMPILE_HTML = () => {
      if (building) return;
      else building = true;
      const htmls = [
        `${__dirname}/build/index.html`,
        `${__dirname}/build/outdated-browser.html`,
        `${__dirname}/build/html/app.html`,
        `${__dirname}/build/html/channel.html`,
        `${__dirname}/build/html/cookie.html`,
        `${__dirname}/build/html/player.html`,
        `${__dirname}/build/html/player-inside.html`,
        `${__dirname}/build/html/result-list.html`,
        `${__dirname}/build/html/result-item.html`,
        `${__dirname}/build/html/what.html`
      ];
      for (const html of htmls) {
        let input = fs.readFileSync(html, "utf8");
        if (html.endsWith("/build/index.html")) {
          input = input
            .replace(
              /{{indicators}}/gi,
              fs.readFileSync(`${__dirname}/build/components/indicators.html`)
            )
            .replace(
              /{{loader}}/gi,
              fs.readFileSync(`${__dirname}/build/components/loader.html`)
            );
        }
        fs.writeFileSync(
          html.replace("/build", dist),
          crush(input, {
            removeLineBreaks: true,
            removeIndentations: true,
            lineLengthLimit: Number.POSITIVE_INFINITY
          }).result,
          "utf8"
        );
        //console.log(`Minified ${html}!`);
      }
      console.log(`Minified html`);
      setTimeout(() => {
        building = false;
      }, 999);
    };

    //BUNDLE JS
    const COMPILE_JS = () => {
      if (building) return;
      else building = true;
      const bundleFile = `${__dirname}/${dist}/bundle.js`;
      let bundle = "";

      const scripts = [
        `${__dirname}/build/js/tools.js`,
        `${__dirname}/build/js/_PLAY.js`,
        `${__dirname}/build/js/_SEARCH.js`,
        `${__dirname}/build/js/bg.js`,
        `${__dirname}/build/js/client.js`
      ];
      for (const script of scripts) {
        bundle += transpile(script, true);
      }
      //write bundle
      const minified = Terser.minify(bundle);
      minified.error
        ? console.warn(minified.error)
        : fs.writeFileSync(bundleFile, `${atto}\r\n${minified.code}`, "utf8");
      console.log(`Bundled ${scripts} into ${bundleFile}!`);
      building = false;
    };

    //SASS
    const COMPILE_CSS = () => {
      if (building) return;
      else building = true;
      const bundleFile = `${__dirname}/${dist}/bundle.css`;
      let bundle = "";

      const styles = [
        `${__dirname}/build/css/lib/neumorphism-light.css`,
        `${__dirname}/build/css/style.sass.css`
      ];
      for (const style of styles) {
        bundle += sass
          .renderSync({
            data: fs.readFileSync(style, "utf8") || "/**/",
            outputStyle: "compressed"
          })
          .css.toString("utf8");
      }
      //write bundle
      fs.writeFileSync(bundleFile, `${atto}\r\n${bundle}`, "utf8");
      console.log(`Bundled ${styles} into ${bundleFile}!`);
      building = false;
    };

    //first compile
    {
      COMPILE_CSS();
      COMPILE_JS();
      COMPILE_HTML();

      //watch changes
      fs.watch(`${__dirname}/build/css/`, COMPILE_CSS);
      fs.watch(`${__dirname}/build/js/`, COMPILE_JS);
      fs.watch(`${__dirname}/build/html/`, COMPILE_HTML);
    }
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

//index
app.get("/", (req, res) => {
  res.send(
    fs
      .readFileSync(`${__dirname}/!dist/index.html`, "utf8")
      .replace(/{{local}}/gi, `${req.protocol}://${req.hostname}/`)
  );
});

// static
app.use(express.static(`${__dirname}/!dist`));

//simple geo ip
app.get(`${API}/geoip`, (req, res) => {
  /*fetch(`http://api.petabyet.com/geoip/${req.ip}`).then(_res => {
    if(_res.status){
      _res=>_res.json.then(() =>{
        _res.pipe
      })
    }
    console.log(res.status)
  })*/
  const _req = request(`http://api.petabyet.com/geoip/${req.ip}`).on(
    "response",
    _res => {
      if (res.statusCode === 200) {
        _res.pipe(res);
      } else setTimeout(_req.end, 999);
    }
  ).on('timeout', ()=>setTimeout(_req.end, 999));

});

//SEARCH
app.get(`${API}/:region/search/:q/:page`, (req, res) => {
  const _req = request({
    uri: encodeURI(
      `https://${process.env.IV_HOST}/api/v1/search/?region=${req.params.region}&q=${req.params.q}&page=${req.params.page}`
    ),
    method: "GET",
    timeout: 3000,
    followRedirect: true,
    maxRedirects: 10
  }).on("response", _res => {
    if (res.statusCode === 200) {
      _res.pipe(res);
    } else setTimeout(_req.end, 999);
  }).on('timeout', ()=>setTimeout(_req.end, 999));
});

//VIDEO
app.get(`${API}/:region/video/:vid`, (req, res) => {
  const _req = request({
    uri: encodeURI(
      `https://${process.env.IV_HOST}/api/v1/videos/${req.params.vid}?region=${req.params.region}`
    ),
    method: "GET",
    timeout: 3000,
    followRedirect: true,
    maxRedirects: 10
  }).on("response", _res => {
    if (res.statusCode === 200) {
      _res.pipe(res);
    } else setTimeout(_req.end, 999);
  }).on('timeout', ()=>setTimeout(_req.end, 999));
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
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

const restartHours = 6;
setTimeout(() => {
  process.on("exit", () => {
    require("child_process").spawn(process.argv.shift(), process.argv, {
      cwd: process.cwd(),
      detached: true,
      stdio: "inherit"
    });
  });
  process.exit();
}, 1000 * 60 * 60 * restartHours); //restart every 6 hours

