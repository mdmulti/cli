const request = require("request");
const fs = require("fs");

require("colors");

const { install_path } = require("../cli");
const CONSTANTS_URL =
  "https://raw.githubusercontent.com/mdmulti/constants/master/constants.json";

exports.command = "constants-update";
exports.desc = "download and save the latest mdmulti constants";

exports.handler = argv => {
  //console.log(install_path);
  console.log("Downloading...");
  request.get(CONSTANTS_URL, (req, res) => {
    try {
      console.log("Saving...");
      fs.writeFileSync(
        install_path + "/constants.json",
        JSON.stringify(JSON.parse(res.body), null, 4)
      );
      console.log("Done!".green);
    } catch (ex) {
      console.error("Error saving file.".red);
      process.exit(1);
    }
  });
};
