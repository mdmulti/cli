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
    // dynamic("sample.mdmc tests/out_file_export", cmd => {
    // .stdout("Exported! The password is blank.".green)

    dx("sample.mdmc tests/out_file_export", 0);

    dx("invalid_json.mdmc fakeSaveLocation", 1);

    dx("missing_data.mdmc fakeSaveLocation", 2);

    dx("invalid_version.mdmc fakeSaveLocation", 3);

    // 4 NOT AVAILABLE

    // MISSING 5

    // MISSING 6

    dx("fake fakeSaveLocation", 7);

    dx("invalid.mdmc fakeSaveLocation", 8);

    dx("sample.mdmc tests/u/n/a/v/a/i/l/a/b/l/e/file", 9);

    // 10 / 11 / 12 NOT AVAILABLE
  });
});
