const fs = require("fs");
const forge = require("node-forge");
require("colors");

exports.command = "info <file>";
exports.desc = "view information about a mdmc file";

exports.builder = yargs => {
  yargs.positional("file", {
    describe: "file to use",
    type: "string"
  });
};

/* Exit Code(s)

    - 0
        no failures
    
    - 1
        invalid JSON

    - 2
        missing data
    
    - 3
        unsupported version
    
    - 4
        invalid keypair

    - 5
        invalid ID (see constants)
    
    - 6
        invalid ServerID (see constants)

    -------------------------------
    
    - 10
        tamper : ID
    
    - 11
        tamper : serverID

    - 12
        tamper : both
    

*/

exports.handler = argv => {
  // So that we can use custom exit codes to signify errors or problems.
  let exitCode = 0;

  let tamperA = false;

  // Check to make sure the file has a .mdmc extension
  if (!argv.file.endsWith(".mdmc")) {
    console.error("Invalid file extension, must be *.mdmc!");
    return;
  }

  // Check to make sure the file exists
  if (!fs.existsSync(argv.file)) {
    console.error("File doesn't exist!");
    return;
  }

  const fileData = fs.readFileSync(argv.file, "utf8");

  // Check to see if the file is valid JSON.
  const data = validateJSON(fileData);

  if (data) {
    // The data is valid JSON
    if (
      data.version != null &&
      data.id != null &&
      data.serverId != null &&
      data.keypairs != null &&
      data.displayName != null
    ) {
      // All datapoints are available

      if (data.version >= 3) {
        // The file is probably a valid *.mdmc file
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
        } catch {
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

function validateJSON(body) {
  try {
    var data = JSON.parse(body);
    // if came to here, then valid
    return data;
  } catch (e) {
    // failed to parse
    return null;
  }
}

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
