const chai = require("chai");

const { n, dynamic } = require("./common");

// Configure chai
chai.should();
describe("Update Command", () => {
  dynamic("update", cmd => {
    it(cmd, done => {
      n()
        .run(cmd)
        .code(0)
        .end(done);
    });
  });

  dynamic("update --source release", cmd => {
    it(cmd, done => {
      n()
        .run(cmd)
        .code(0)
        .end(done);
    });
  });

  dynamic("update --source bleeding", cmd => {
    it(cmd, done => {
      n()
        .run(cmd)
        .code(0)
        .end(done);
    });
  });

  dynamic("update --source invalid", cmd => {
    it(cmd + " (expecting exit code 1)", done => {
      n()
        .run(cmd)
        .code(1)
        .end(done);
    });
  });
});
