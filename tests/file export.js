const chai = require("chai");

require("colors");

const { n } = require("./common");

// Custom dynamic function
const dynamic = (str, nest) => {
  nest("file export tests/sample-data/mdmc_f3c4/" + str);
};

// One-liner dynamic alternative
const dx = (str, code) => {
  dynamic(str, cmd => {
    it(`Input: ${str} | Expecting code ${code}`, done => {
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
  describe("Export", () => {
    dx("sample.mdmc tests/out_file_export", 0); // .stdout("Exported! The password is blank.".green)

    dx("invalid_json.mdmc fakeSaveLocation", 1);
    dx("missing_data.mdmc fakeSaveLocation", 2);
    dx("invalid_version.mdmc fakeSaveLocation", 3);

    // 4 NOT AVAILABLE

    dx("invalid_id.mdmc fakeSaveLocation", 5);
    dx("invalid_server_id.mdmc fakeSaveLocation", 6);
    dx("fake fakeSaveLocation", 7);
    dx("invalid.mdmc fakeSaveLocation", 8);
    dx("sample.mdmc tests/u/n/a/v/a/i/l/a/b/l/e/file", 9);

    // 10 / 11 / 12 NOT AVAILABLE
  });
});
