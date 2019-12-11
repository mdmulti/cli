const nixt = require("nixt");

// Nixt 'template'
const n = () => {
  return nixt().base("node cli.js ");
};

// Callbackable container to reduce duplicate strings
const dynamic = (str, nest) => {
  nest(str);
};

module.exports = {
  n,
  dynamic
};
