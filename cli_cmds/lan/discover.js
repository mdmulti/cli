exports.command = "discover";
exports.desc = "search for peers over lan";

exports.builder = yargs => {
  yargs.positional("types", {
    choices: ["all", "broadcast", "multicast"],
    describe: "detection types to search for",
    default: "all"
  });
};

exports.handler = argv => {
  // do something with argv.
  console.log(argv.types);
  console.log("DJS");
};
