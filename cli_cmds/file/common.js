const constants = require("../../constants.json");

function validateJSON(body) {
  try {
    var data = JSON.parse(body);
    // if came to here, then valid
    return data;
  } catch (e) {
    // failed to parse
    return null;
  }
}

function isHex(h) {
  return /[0-9A-Fa-f]{6}/g.test(h);
}

function isValidId(id) {
  return id.length == constants.cert_serial_len_bytes * 2 && isHex(id);
}

function allDatapointsAvailable(data) {
  return (
    data.version != null &&
    data.id != null &&
    data.serverId != null &&
    data.keypairs != null &&
    data.displayName != null
  );
}

module.exports = {
  validateJSON,
  isValidId,
  allDatapointsAvailable
};
