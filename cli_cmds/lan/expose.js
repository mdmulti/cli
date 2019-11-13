const c = require("../../constants.json").lan;

const dgram = require("dgram");

exports.command = "expose";
exports.desc = "pretend to be a peer accessible over lan";

exports.builder = yargs => {
  yargs.positional("types", {
    choices: ["all", "broadcast", "multicast"],
    describe: "services to listen on",
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/// Please note that we CANNOT use intervals here as you cannot run multiple intervals at once.

function createBroadcast() {
  console.log("Setting up Broadcast sending...");

  const mcast = dgram.createSocket("udp4");
  // Bind to all interfaces on a random port.
  mcast.bind();

  mcast.on("listening", function() {
    // Enable the broadcast mode
    mcast.setBroadcast(true);
    // Send a packet every 1.5 seconds.
    sendPacket(mcast, "255.255.255.255", c.broadcast.port, "Broadcast");
  });
}

function createMulticast() {
  console.log("Setting up Multicast sending...");

  const mcast = dgram.createSocket("udp4");
  // Bind to all interfaces on a random port.
  mcast.bind();

  mcast.on("listening", function() {
    // Join the multicast group
    mcast.addMembership(c.multicast.address);
    // Send a packet every 1.5 seconds.
    sendPacket(mcast, c.multicast.address, c.multicast.port, "Multicast");
  });
}

async function sendPacket(mcast, address, port, typeName) {
  while (true) {
    mcast.send("MDMulti/1/MDMCLI/0.0.0.0/0", port, address);
    console.log(`Sent ${typeName} packet.`);
    await sleep(1500);
  }
}
