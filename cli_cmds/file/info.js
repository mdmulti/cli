// For exit code information please see exit_codes.txt

const fs = require("fs");
const forge = require("node-forge");

require("colors");

const { validateJSON, isValidId, allDatapointsAvailable } = require("./common");

exports.command = "info <file>";
exports.desc = "view information about a mdmc file";

exports.builder = yargs => {
  yargs.positional("file", {
    describe: "file to use",
    type: "string"
  });
};

exports.handler = argv => {
  // So that we can use custom exit codes to signify errors or problems.
  let exitCode = 0;

  let tamperA = false;

  // Check to make sure the file has a .mdmc extension
  if (!argv.file.endsWith(".mdmc")) {
    console.error("Invalid file extension, must be *.mdmc!");
    // Let's exit with a custom exit code instead.
    // return;
    process.exit(7);
  }

  // Check to make sure the file exists
  if (!fs.existsSync(argv.file)) {
    console.error("File doesn't exist!");
    // Let's exit with a custom exit code instead.
    // return;
    process.exit(8);
  }

  const fileData = fs.readFileSync(argv.file, "utf8");

  // Check to see if the file is valid JSON.
  const data = validateJSON(fileData);

  if (data) {
    // The data is valid JSON
    if (allDatapointsAvailable(data)) {
      // All datapoints are available

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

        console.log(`File Format Version: ${data.version.toString().yellow}`);
        console.log(`User name: ${data.displayName.toString().yellow}`);
        console.log(
          "Possible".cyan +
            ` User ID: ${data.id.toString().toLocaleLowerCase().yellow}`
        );
        console.log(
          "Possible".cyan + ` Server ID: ${data.serverId.toString().yellow}`
        );

        console.log("Loading certificate....".red);
        // Attempt to load the pkcs12 certificate using node-forge

        let cert = null;

        try {
          const certn64 = forge.util.decode64(data.keypairs);
          const certAsn1 = forge.asn1.fromDer(certn64);
          const certForge = forge.pkcs12.pkcs12FromAsn1(certAsn1, "");
          cert = certForge.getBags({ bagType: forge.pki.oids.certBag })[
            forge.pki.oids.certBag
          ][0];

          console.log("Certificate loaded!".green);
          // We don't need the exception details, but we assign them anyway
          // to fix errors on Node <10.
        } catch (e) {
          // Error loading certificate - keypairs have likely been messed with
          console.error("Error loading certificate!\nInvalid keypair!".red);
          process.exit(4);
        }

        console.log(
          "Actual".cyan +
            ` User ID: ${cert.cert.serialNumber.toString().yellow}`
        );
        console.log(
          "Actual".cyan +
            ` Server ID: ${
              findOID(cert, "1.3.6.1.4.1.54622.0.1.3").toString().yellow
            }`
        );
        console.log(
          `Certificate protocol: ${
            findOID(cert, "1.3.6.1.4.1.54622.0.1.1").toString().yellow
          }`
        );

        // Check the Possible vs Actual responses (User)
        if (
          data.id.toString().toLocaleLowerCase() ==
          cert.cert.serialNumber.toString().toLocaleLowerCase()
        ) {
          console.log("User ID values match!".green);
        } else {
          console.log(
            "User ID values do not match. This file has been tampered with.".red
          );
          exitCode = 10;
          tamperA = true;
        }

        // Check the Possible vs Actual responses (User)
        if (
          data.serverId.toString().toLocaleLowerCase() ==
          findOID(cert, "1.3.6.1.4.1.54622.0.1.3").toLocaleLowerCase()
        ) {
          console.log("Server ID values match!".green);
        } else {
          console.log(
            "Server ID values do not match. This file has been tampered with."
              .red
          );
          exitCode = !tamperA ? 11 : 12;
        }

        // End of command function
      } else {
        console.error("Unsupported file format, must be mdmc v3 or later.");
        exitCode = 3;
        // no return statement as we still want process.exit() to run.
      }
    } else {
      console.error("Missing data!");
      exitCode = 2;
    }
  } else {
    console.error("File is not valid JSON!");
    exitCode = 1;
    // no return statement as we still want process.exit() to run.
  }

  // Exit with the defined exit code (useful for testing!)
  process.exit(exitCode);
};

function findOID(certObj, oid) {
  const oidArr = certObj.cert.extensions;
  return (
    oidArr
      .find(i => i.id === oid)
      .value.toString()
      // Three hex characters are part of our custom OIDs
      .substring(3)
  );
}
