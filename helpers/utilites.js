const crypto = require("crypto");
const env = require("./environment");

const utilies = {};

utilies.parseJson = (jsonString) => {
  let output = {};

  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  return output;
};

utilies.encrypt = (data) => {
  const encryptedData = crypto
    .createHmac("sha256", env.secretKey)
    .update(data)
    .digest("hex");

  return encryptedData;
};

utilies.createToken = (strlen) => {
  const tokenId = crypto.randomBytes(strlen).toString("hex");

  return tokenId;
};
module.exports = utilies;
