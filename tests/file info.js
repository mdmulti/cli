const chai = require("chai");

const { n } = require("./common");
const { version } = require("../package.json");

// Custom dynamic function
const dynamic = (str, code, nest) => {
  nest(str, code, "file info tests/sample-data/mdmc_f3c4/" + str);
};

console.log(process.cwd());

// Configure chai
chai.should();
describe("File", () => {
  describe(`Info`, () => {
    dynamic("invalid_json.mdmc", 1, (name, code, cmd) => {
      it(`Sample file: ${name} | Expecting code ${code}`, done => {
        n()
          .run(cmd)
          .code(code)
          .end(done);
      });
    });

    dynamic("missing_data.mdmc", 2, (name, code, cmd) => {
      it(`Sample file: ${name} | Expecting code ${code}`, done => {
        n()
          .run(cmd)
          .code(code)
          .end(done);
      });
    });

    dynamic("invalid_version.mdmc", 3, (name, code, cmd) => {
      it(`Sample file: ${name} | Expecting code ${code}`, done => {
        n()
          .run(cmd)
          .code(code)
          .end(done);
      });
    });

    dynamic("invalid_keypair.mdmc", 4, (name, code, cmd) => {
      it(`Sample file: ${name} | Expecting code ${code}`, done => {
        n()
          .run(cmd)
          .code(code)
          .end(done);
      });
    });

    // MISSING 5

    // MISSING 6

    // --------------------

    // MISSING 10

    // MISSING 11

    dynamic("tampered.mdmc", 12, (name, code, cmd) => {
      it(`Sample file: ${name} | Expecting code ${code}`, done => {
        n()
          .run(cmd)
          .code(code)
          .end(done);
      });
    });
  });
});
