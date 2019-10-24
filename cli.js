#!/usr/bin/env node
require("yargs")
  .commandDir("cli_cmds")
  .demandCommand()
  .help().argv;
