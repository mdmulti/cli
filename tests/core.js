const chai = require("chai");

const { n, dynamic } = require("./common");
const { version } = require("../package.json");

// Configure chai
chai.should();
describe("Core", () => {
  describe(`Version commands`, () => {
    dynamic("-v", cmd => {
      it(`Shorthand (${cmd})`, done => {
        n()
          .run(cmd)
          .stdout(version)
          .end(done);
      });
    });

    dynamic("--version", cmd => {
      it(`Longhand  (${cmd})`, done => {
        n()
          .run(cmd)
          .stdout(version)
          .end(done);
      });
    });
  });

  describe(`Help commands`, () => {
    it(`Root only`, done => {
      n()
        .run("")
        .code(1)
        .end(done);
    });

    dynamic("-h", cmd => {
      it(`Root (${cmd})`, done => {
        n()
          .run(cmd)
          .code(0)
          .end(done);
      });
    });

    dynamic("--help", cmd => {
      it(`Root (${cmd})`, done => {
        n()
          .run(cmd)
          .code(0)
          .end(done);
      });
    });

    dynamic("file", cmd => {
      it(cmd, done => {
        n()
          .run(cmd)
          .code(1)
          .end(done);
      });
    });

    dynamic("lan", cmd => {
      it(cmd, done => {
        n()
          .run(cmd)
          .code(1)
          .end(done);
      });
    });
  });
});
