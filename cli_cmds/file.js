exports.command = "file <command>";
exports.desc = "various *.mdmc (mdm client) file commands";
exports.builder = yargs => {
  return yargs.commandDir("file");
};
