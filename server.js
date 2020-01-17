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
  request = require("request");
// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

const prefix = "/api";

app.get(`${prefix}/complete/:l::q`, (req, res) => {
  const empty = "No results found..."
  var url = `http://suggestqueries.google.com/complete/search?client=youtube&cp=1&ds=yt&q=${req.params.q}&hl=${req.params.l}&format=5&alt=json&callback=?`;
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
      if (body) {
        let suggs = [];

        if (body.split("[[")[1]) {
          body = `[${body.split("[[")[1].split("]]")[0]}]`.split(",");

          for (const sugg of body) {
            sugg !== "0]" &&
              sugg.slice(2, -1).length > 0 &&
              suggs.push(decodeURIComponent(sugg.slice(2, -1)));
          }

          suggs = JSON.stringify(suggs)
            .normalize()
            .normalize()
            .slice(2, -1);

          res.json({code: 200, data: "." + suggs.slice(0, -1) + "."});
        } else res.json({code: 404, msg: empty});
      } else res.json();
    }
  );
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
