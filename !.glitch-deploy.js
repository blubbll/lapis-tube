//© glitch-deploy by blubbll
{
  require("child_process").exec("pnpm i glob ftp");

  //imports
  const fs = require("fs"),
    path = require("path"),
    glob = require("glob"),
    ftpClient = require("ftp");
  //tool
  const fontMap = new Map();
  fontMap.set(
    "mathMono",
    new Map([
      ["A", "𝙰"],
      ["B", "𝙱"],
      ["C", "𝙲"],
      ["D", "𝙳"],
      ["E", "𝙴"],
      ["F", "𝙵"],
      ["G", "𝙶"],
      ["H", "𝙷"],
      ["I", "𝙸"],
      ["J", "𝙹"],
      ["K", "𝙺"],
      ["L", "𝙻"],
      ["M", "𝙼"],
      ["N", "𝙽"],
      ["O", "𝙾"],
      ["P", "𝙿"],
      ["Q", "𝚀"],
      ["R", "𝚁"],
      ["S", "𝚂"],
      ["T", "𝚃"],
      ["U", "𝚄"],
      ["V", "𝚅"],
      ["W", "𝚆"],
      ["X", "𝚇"],
      ["Y", "𝚈"],
      ["Z", "𝚉"],
      ["a", "𝚊"],
      ["b", "𝚋"],
      ["c", "𝚌"],
      ["d", "𝚍"],
      ["e", "𝚎"],
      ["f", "𝚏"],
      ["g", "𝚐"],
      ["h", "𝚑"],
      ["i", "𝚒"],
      ["j", "𝚓"],
      ["k", "𝚔"],
      ["l", "𝚕"],
      ["m", "𝚖"],
      ["n", "𝚗"],
      ["o", "𝚘"],
      ["p", "𝚙"],
      ["q", "𝚚"],
      ["r", "𝚛"],
      ["s", "𝚜"],
      ["t", "𝚝"],
      ["u", "𝚞"],
      ["v", "𝚟"],
      ["w", "𝚠"],
      ["x", "𝚡"],
      ["y", "𝚢"],
      ["z", "𝚣"],
      ["0", "𝟶"],
      ["1", "𝟷"],
      ["2", "𝟸"],
      ["3", "𝟹"],
      ["4", "𝟺"],
      ["5", "𝟻"],
      ["6", "𝟼"],
      ["7", "𝟽"],
      ["8", "𝟾"],
      ["9", "𝟿"]
    ])
  );
  const toMono = o => (
    fontMap.get("mathMono").forEach((e, n) => {
      o = o.replace(new RegExp(n, "g"), e);
    }),
    o
  );
  const deploy = options =>
    new Promise(async (resolve, reject) => {
      const icon = {
        self: "🛠️",
        dir: "📁",
        file: "📄",
        up: "↗️",
        ok: "✅",
        rem: "🗑️",
        add: "✨",
        env: "🔑"
      };
      //construct client
      const c = new ftpClient();
      //clear existing files
      const _clear = () =>
        new Promise((resolve, reject) => {
          let oldfiles = 0,
            oldfilesgone = 0,
            oldfolders = 0,
            oldfoldersgone = 0;
          c.list("/", 0, function(err, list) {
            list.forEach(file => {
              //delete remote folders
              if (file.type === "d") {
                if (!["..", "."].includes(file.name)) {
                  oldfolders++;
                  c.rmdir(file.name, () => {
                    oldfoldersgone++;
                    options.verbose &&
                      console.log(
                        toMono(
                          `${icon.self}${icon.rem}${icon.dir}deleting remote folder '${file.name}'...`
                        )
                      );
                    if (oldfilesgone + oldfoldersgone === oldfiles + oldfolders)
                      resolve();
                  });
                }
                //delete remote files
              } else {
                if (file.name !== ".ftpquota") {
                  //skip indeletable file
                  oldfiles++;
                  c.delete(file.name, () => {
                    options.verbose &&
                      console.log(
                        toMono(
                          `${icon.self}${icon.rem}${icon.file}deleting remote file '${file.name}'...`
                        )
                      );
                    oldfilesgone++;
                    if (oldfilesgone + oldfoldersgone === oldfiles + oldfolders)
                      resolve();
                  });
                }
              }
            });
          });
        });
      //deploy .env
      const _syncenv = async apply => {
        const f = `${__dirname}/.env`, //where file is locally
          rf = `.dpl.env`, //where to put file to on remote directory
          rfl = `${__dirname}/${rf}`; //location of remote file when uploaded
        const _put = () =>
          new Promise((resolve, reject) => {
            c.put(f, rf, err => {
              if (!err) {
                options.verbose &&
                  console.log(
                    toMono(`${icon.self}${icon.add}${icon.env}deployed .env!`)
                  );
                return resolve();
              } else
                return reject(
                  `deploy error: ${err} while uploading ${f} to ${rf}`
                );
            });
          });
        const _apply = () =>
          new Promise((resolve, reject) => {
            //loop through lines
            require("fs")
              .readFileSync(`${__dirname}/${rf}`, "utf-8")
              .split(/\r?\n/)
              .forEach(line => {
                if (line.includes("=") && !line.includes("#")) {
                  const _var = line.split("=")[0];
                  const _val = line.split("=")[1];
                  //if env not exist, apply value
                  if (!process.env[_var]) {
                    process.env[_var] = _val;
                    options.verbose &&
                      console.log(
                        toMono(
                          `${icon.self}${icon.add} Applied ${_var} with value ${_val}!`
                        )
                      );
                  }
                }
              });
            options.verbose &&
              console.log(
                toMono(
                  `${icon.self}${icon.add}${icon.env}Applied .env from file ${rfl}!`
                )
              );
            //fs.unlinkSync(rfl); //delete file after applying again
            resolve();
          });
        return !apply ? await _put() : await _apply();
      };

      //deploy data
      const _deploy = () =>
        new Promise((resolve, reject) => {
          glob(`${__dirname}/**`, async (er, files) => {
            const lfiles = [], //local files
              lfolders = []; //local folders
            //put local files into correct array
            files.forEach(fd => {
              if (
                !fd.startsWith(".") &&
                ![
                  "./data",
                  "/app",
                  "/app/node_modules",
                  "/app/package-lock.json"
                ].includes(fd)
              ) {
                //blacklist
                path.extname(fd).length ? lfiles.push(fd) : lfolders.push(fd);
              }
            });
            //make dirs on remote
            const _upfolders = dirs =>
              new Promise((resolve, reject) => {
                let newfolders = 0,
                  newfoldersdone = 0;
                dirs.forEach(dir => {
                  const folder = `${dir.split("/app/")[1]}`;
                  options.verbose &&
                    console.log(
                      toMono(
                        `${icon.self}${icon.add}${icon.dir}creating remote dir '${folder}'...`
                      )
                    );
                  newfolders++;
                  c.mkdir(folder, true, () => {
                    newfoldersdone++;
                    if (newfoldersdone === newfolders) {
                      resolve();
                    }
                  });
                });
              });
            //upload files
            const _upfiles = files =>
              new Promise((resolve, reject) => {
                let newfiles = 0,
                  newfilesdone = 0;
                let curr = 0;
                files.forEach(file => {
                  const rf = file.startsWith("/app/")
                    ? file.split(/app(.*)/)[1]
                    : file; //calculate remote path
                  if (fs.existsSync(file)) {
                    //maybe-redundant local-exist check
                    newfiles++;
                    options.verbose &&
                      console.log(
                        toMono(
                          `${icon.self}${icon.up}${icon.file}loading '${file}' to '${rf}'...`
                        )
                      );
                    c.put(file, rf, err => {
                      newfilesdone++;
                      if (newfilesdone === newfiles) {
                        resolve();
                      }
                      if (err)
                        return reject(
                          `deploy error: '${err}' while uploading ${file} to ${rf}`
                        );
                    });
                  }
                });
              });
            //wait for folders and files
            [await _upfolders(lfolders), await _upfiles(lfiles)];
            {
              const d =
                lfolders.length > 0
                  ? `${lfolders.length} folder${lfolders.length > 1 && "s"}`
                  : void 0;
              const f =
                lfiles.length > 0
                  ? `${lfiles.length} file${lfiles.length > 1 && "s"}`
                  : void 0;
              resolve({
                d,
                f
              });
            }
          });
        });
      //actual start
      if (process.env.PROJECT_DOMAIN) {
        //is glitch project
        console.log(
          toMono(
            `${icon.self}Starting deployment${
              options.clear ? " (➕remote clear)" : ""
            }${options.env ? " (➕.env copy)" : ""}...`
          )
        );
        c.on("ready", async () => {
          //deploy FROM glitch
          options.clear && (await _clear());
          const dr = await _deploy(); //deploy result
          options.env && (await _syncenv());
          console.log(
            toMono(
              `${icon.self}${icon.ok}${
                dr.f && dr.d ? `${dr.f} & ${dr.d}` : dr.f
              }${options.env ? " and .env" : ""} deployed!`
            )
          );
          c.end();
          return resolve();
        });
        c.connect(options.ftp);
      } else {
        await _syncenv(true);
        return resolve();
      }
    });
  process.on("unhandledRejection", err => {
    const self = __filename;
    //if error came from this module
    if (err && err.stack && err.stack.includes(`(${self}`)) {
      const msg = `❌${self}${err.lineNumer ? err.lineNumber : ""}: '${
        err.message ? err.message : err
      }'`;
      console.warn(msg);
      fs.writeFileSync("Err.txt", msg);
    }
  });
  module.exports = deploy;
}
