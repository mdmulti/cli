#!/usr/bin/env node

module.exports = {
  install_path: require("fs").realpathSync(__dirname)
};

require("yargs")
  // Set the app name in responses
  .scriptName("mdmcli")
  // Use commands from the cli_cmds folder
  .commandDir("cli_cmds")
  // Show help if command not valid
  .demandCommand()
  // Enable --help and --version
  .help()
  .version()
  // Set aliases
  .alias("help", "h")
  .alias("version", "v").argv;
