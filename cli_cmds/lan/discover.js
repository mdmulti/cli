const c = require("../../constants.json").lan.multicast;

const dgram = require("dgram");

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

  switch (argv.types) {
    case "multicast":
      createMulticast();
      break;
    case "broadcast":
      createBroadcast();
      break;
    default:
      createMulticast();
      createBroadcast();
      break;
  }
};

function onData(data, via) {
  if (data.toString().startsWith("MDMulti/1/")) {
    const split = data.toString().split("/");
    console.log(
      `${split[2]} server found, PeerConnection at ${split[3]}:${
        split[4]
      }/udp (via ${via})`
    );
  }
}

function createMulticast() {
  const mcast = dgram.createSocket("udp4");

  mcast.bind(29571, "0.0.0.0", () => {
    mcast.addMembership(c.address);
  });

  console.log(`Listening to multicast at ${c.address}:${c.port}`);

  mcast.on("message", data => onData(data, "mcast"));

  return mcast;
}

function createBroadcast() {
  const mcast = dgram.createSocket("udp4");
  mcast.bind(25816);

  console.log(`Listening to broadcast at ${c.address}:${c.port}`);

  mcast.on("message", data => onData(data, "bcast"));

  return mcast;
}
