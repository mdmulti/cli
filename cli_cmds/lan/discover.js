const c = require("../../constants.json").lan;

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
    mcast.addMembership(c.multicast.address);
  });

  console.log(
    `Listening to multicast at ${c.multicast.address}:${c.multicast.port}`
  );

  mcast.on("message", data => onData(data, "mcast"));

  return mcast;
}

function createBroadcast() {
  const mcast = dgram.createSocket("udp4");
  mcast.bind(c.broadcast.port);

  console.log(`Listening to broadcast at 255.255.255.255:${c.broadcast.port}`);

  mcast.on("message", data => onData(data, "bcast"));

  return mcast;
}
