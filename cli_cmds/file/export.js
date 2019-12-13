// For exit code information please see exit_codes.txt

const fs = require("fs");

require("colors");

const { validateJSON, allDatapointsAvailable, isValidId } = require("./common");

exports.command = "export <file> <exportPath>";
exports.desc = "export the certificate from a mdmc file";

exports.builder = yargs => {
  yargs.positional("file", {
    describe: "file to use",
    type: "string"
  });
  yargs.positional("exportPath", {
    describe: "path to export to",
    type: "string"
  });
};

// TODO: Consolidate the MDMC validation into a helper class, See #7/github.

exports.handler = argv => {
  // Check to make sure the file has a .mdmc extension
  if (!argv.file.endsWith(".mdmc")) {
    console.error("Invalid file extension, must be *.mdmc!");
    process.exit(7);
  }

  // Check to make sure the file exists
  if (!fs.existsSync(argv.file)) {
    console.error("File doesn't exist!");
    process.exit(8);
  }

  const fileData = fs.readFileSync(argv.file, "utf8");

  // Check to see if the file is valid JSON.
  const data = validateJSON(fileData);

  if (data) {
    // The data is valid JSON

    if (!allDatapointsAvailable(data)) {
      console.error("Missing data!");
      process.exit(2);
    }

    if (data.version >= 3) {
      // The file is probably a valid *.mdmc file

      // Check if the *POSSIBLE* server / user IDs are valid
      // I know we could check against both and have a 3rd exit code but
      // we can't compare if they are invalid anyways.

      // Therefore we will just put a process.exit on each ID check.
      if (!isValidId(data.id)) {
        console.error("Invalid ID!".red);
        process.exit(5);
      }

      if (!isValidId(data.serverId)) {
        console.error("Invalid Server ID!".red);
        process.exit(6);
      }

      try {
        // Add the pfx extension to the export path if it was not already present
        if (!argv.exportPath.endsWith(".pfx")) argv.exportPath += ".pfx";
        // Save the file
        fs.writeFileSync(argv.exportPath, data.keypairs);
        console.log("Exported! The password is blank.".green);
      } catch {
        console.error("Could not save the certificate.");
        process.exit(9);
      }

      // End of command function
    } else {
      console.error("Unsupported file format, must be mdmc v3 or later.");
      process.exit(3);
    }
  } else {
    console.error("File is not valid JSON!");
    process.exit(1);
  }
};
