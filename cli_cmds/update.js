const request = require("request");
const cmpVer = require("compare-versions");
const colors = require("colors");

let REQ_URL = "https://registry.npmjs.org/mdmcli/latest";
const REQ_URL_BLEEDING =
  "https://raw.githubusercontent.com/mdmulti/cli/master/package.json";

exports.command = "update";
exports.desc = "check for updates";

exports.builder = yargs => {
  yargs.positional("source", {
    choices: ["release", "bleeding"],
    describe: "update source to check against",
    default: "release"
  });
};

exports.handler = argv => {
  const bef = new Date();
  let prefix = "";
  if (argv.source == "bleeding") {
    REQ_URL = REQ_URL_BLEEDING;
    prefix = "Bleeding".magenta + " => ".gray;
  }

  REQ_URL = request(REQ_URL, (req, res) => {
    const updateAvailable = cmpVer.compare(
      JSON.parse(res.body).version,
      require("../cli").version,
      "<"
    );
    const took = `(took ${new Date() - bef}ms)`.grey;

    if (updateAvailable) {
      console.log(
        `${prefix}${"Update Available!".bgRed} Run '${
          "npm i -g mdmcli".cyan
        }' to install the latest version. ${took}`
      );
    } else {
      console.log(`${prefix}${colors.green("You are up-to-date!")} ${took}`);
    }
  });
};
