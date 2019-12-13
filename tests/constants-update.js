const chai = require("chai");

const { n, dynamic } = require("./common");

// Configure chai
chai.should();
describe("Constants Update Command", () => {
  dynamic("constants-update", cmd => {
    it(cmd, done => {
      n()
        .run(cmd)
        .code(0)
        .end(done);
    });
  });
});
