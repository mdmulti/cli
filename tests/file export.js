const chai = require("chai");

require("colors");

const { n } = require("./common");

// Custom dynamic function
const dynamic = (str, nest) => {
  nest("file export tests/sample-data/mdmc_f3c4/" + str);
};

// Configure chai
chai.should();
describe("File", () => {
  describe("Export", () => {
    dynamic("sample.mdmc tests/out_file_export", cmd => {
      it(cmd, done => {
        n()
          .run(cmd)
          .code(0)
          .stdout("Exported! The password is blank.".green)
          .end(done);
      });
    });

    // MISSING 1

    // MISSING 2

    // AVAILABLE 3

    // 4 NOT AVAILABLE

    // MISSING 5

    // MISSING 6

    dynamic("fake fakeSaveLocation", cmd => {
      it(cmd, done => {
        n()
          .run(cmd)
          .code(7)
          .end(done);
      });
    });

    dynamic("invalid.mdmc fakeSaveLocation", cmd => {
      it(cmd, done => {
        n()
          .run(cmd)
          .code(8)
          // .stdout("File doesn't exist!") // some reason doesn't work
          .end(done);
      });
    });

    dynamic("sample.mdmc tests/u/n/a/v/a/i/l/a/b/l/e/file", cmd => {
      it(cmd, done => {
        n()
          .run(cmd)
          .code(9)
          // .stdout("Could not save the certificate.") // some reason doesn't work
          .end(done);
      });
    });

    // 10 / 11 / 12 NOT AVAILABLE
  });
});
