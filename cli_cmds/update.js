const request = require("request");
const cmpVer = require("compare-versions");
const colors = require("colors");

const REQ_URL = "https://registry.npmjs.org/mdmcli/latest";

exports.command = "update";
exports.desc = "check for updates";

exports.handler = argv => {
  const bef = new Date();
  request(REQ_URL, (req, res) => {
    const updateAvailable = cmpVer.compare(
      JSON.parse(res.body).version,
      require("../cli").version,
      "<"
    );
    const took = `(took ${new Date() - bef}ms)`.grey;

    if (updateAvailable) {
      console.log(
        `${"Update Available!".bgRed} Run '${
          "npm -i -g mdmcli@latest".cyan
        }' to install the latest version. ${took}`
      );
    } else {
      console.log(`${colors.green("You are up-to-date!")} ${took}`);
    }

    console.log("NPM " + JSON.parse(res.body).version);
    console.log("C " + require("../cli").version);
  });
};
