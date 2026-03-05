const data = require("../../lib/data");
const { encrypt, parseJson } = require("../../helpers/utilites");

const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const accMethods = ["get", "put", "post", "delete"];

  if (accMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
  const phoneNum =
    typeof requestProperties.body.phoneNum === "string" &&
    requestProperties.body.phoneNum.trim().length === 11
      ? requestProperties.body.phoneNum
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phoneNum && password) {
    data.read("user", phoneNum, (err, userData) => {
      if (!err) {
        
      } else {
        callback(404, {
          error: "Could not find the user!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Phone number or password invalid!",
    });
  }
};

handler._token.get = (requestProperties, callback) => {};

handler._token.put = (requestProperties, callback) => {};

handler._token.delete = (requestProperties, callback) => {};

module.exports = handler;
