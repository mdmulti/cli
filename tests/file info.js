const chai = require("chai");

const { n } = require("./common");

// Custom dynamic function
const dynamic = (str, code, nest) => {
  nest(str, code, "file info tests/sample-data/mdmc_f3c4/" + str);
};

// One-liner dynamic alternative
const dx = (str, code) => {
  dynamic(str, code, (name, code, cmd) => {
    it(`X | Sample file: ${name} | Expecting code ${code}`, done => {
      n()
        .run(cmd)
        .code(code)
        .end(done);
    });
  });
};

console.log(process.cwd());

// Configure chai
chai.should();
describe("File", () => {
  describe(`Info`, () => {
    // Ooohhhh, one line tests!
    dx("invalid_json.mdmc", 1);
    dx("missing_data.mdmc", 2);
    dx("invalid_version.mdmc", 3);
    dx("invalid_keypair.mdmc", 4);
    // MISSING 5
    // MISSING 6

    // --------------------

    // MISSING 10
    // MISSING 11
    dx("tampered.mdmc", 12);
  });
});
