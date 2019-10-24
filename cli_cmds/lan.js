exports.command = "lan <command>";
exports.desc = "various lan commands";
exports.builder = yargs => {
  return yargs.commandDir("lan");
};
