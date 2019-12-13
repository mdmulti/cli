const chai = require("chai");

const { n } = require("./common");
const { version } = require("../package.json");

// Custom dynamic function
const dynamic = (str, nest) => {
  nest(str, "file info tests/sample-data/mdmc_f3c4/" + str);
};

console.log(process.cwd());

// Configure chai
chai.should();
describe("File", () => {
  describe(`Info`, () => {
    dynamic("invalid_json.mdmc", (name, cmd) => {
      it(`Sample file: ${name}`, done => {
        n()
          .run(cmd)
          .code(1)
          .end(done);
      });
    });

    dynamic("missing_data.mdmc", (name, cmd) => {
      it(`Sample file: ${name}`, done => {
        n()
          .run(cmd)
          .code(2)
          .end(done);
      });
    });

    dynamic("invalid_version.mdmc", (name, cmd) => {
      it(`Sample file: ${name}`, done => {
        n()
          .run(cmd)
          .code(3)
          .end(done);
      });
    });

    dynamic("invalid_keypair.mdmc", (name, cmd) => {
      it(`Sample file: ${name}`, done => {
        n()
          .run(cmd)
          .code(4)
          .end(done);
      });
    });
  });
});
