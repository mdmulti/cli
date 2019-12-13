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

// Configure chai
chai.should();
describe("File", () => {
  describe(`Info`, () => {
    // Ooohhhh, one line tests!

    dx("sample.mdmc", 0);

    dx("invalid_json.mdmc", 1);
    dx("missing_data.mdmc", 2);
    dx("invalid_version.mdmc", 3);
    dx("invalid_keypair.mdmc", 4);
    dx("invalid_id.mdmc", 5);
    dx("invalid_server_id.mdmc", 6);
    dx("invalid.invalid", 7);
    dx("invalid.mdmc", 8);

    // --------------------

    dx("tampered_id.mdmc", 10);
    dx("tampered_server_id.mdmc", 11);
    dx("tampered_both.mdmc", 12);
  });
});
