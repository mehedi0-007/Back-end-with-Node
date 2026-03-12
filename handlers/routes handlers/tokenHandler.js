const data = require("../../lib/data");
const { encrypt, parseJson, createToken } = require("../../helpers/utilites");

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
      let hashPass = encrypt(password);
      if (!err && hashPass === parseJson(userData).password) {
        let tokenID = createToken(15);
        let expireTime = Date.now() + 60 * 60 * 1000;
        let tokenObj = {
          phoneNum,
          id: tokenID,
          expire: expireTime,
        };

        data.create("token", tokenID, tokenObj, (err) => {
          if (!err) {
            callback(200, {
              msg: "User Token created successfully",
            });
          } else {
            callback(404, {
              error: "Could not create token for the user",
            });
          }
        });
      } else {
        callback(404, {
          error: "Invalid Password!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Phone number or password invalid!",
    });
  }
};

handler._token.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryString.id === "string" &&
    requestProperties.queryString.id.trim().length === 30
      ? requestProperties.queryString.id
      : false;

  if (id) {
    data.read("token", id, (err, user) => {
      const userData = { ...parseJson(user) };
      if (!err && userData) {
        callback(200, userData);
      } else {
        callback(404, {
          error: "Could not find the user in the database",
        });
      }
    });
  } else {
    callback(404, {
      error: "Could not validate user",
    });
  }
};

handler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 30
      ? requestProperties.body.id
      : false;

  const extend =
    typeof requestProperties.body.extend === "boolean"
      ? requestProperties.body.extend
      : false;

  if (id && extend) {
    data.read("token", id, (err, UsrToken) => {
      if (!err) {
        const tokenObj = { ...parseJson(UsrToken) };
        if (tokenObj.expire > Date.now()) {
          tokenObj.expire = Date.now() + 3600 * 1000;
          data.update("token", tokenObj.id, tokenObj, (err) => {
            if (!err) {
              callback(200, {
                msg: "Successfully extended the token period",
              });
            } else {
              callback(404, {
                error: "Could not extend the token period",
              });
            }
          });
        } else {
          callback(404, {
            error: "Token already expired",
          });
        }
      } else {
        callback(404, {
          error: "Could not find the user data",
        });
      }
    });
  } else {
    callback(404, {
      error: "Could not validate the data",
    });
  }
};

handler._token.delete = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryString.id === "string" &&
    requestProperties.queryString.id.trim().length === 30
      ? requestProperties.queryString.id
      : false;

  if (id) {
    data.read("token", id, (err, user) => {
      if (!err) {
        data.delete("token", id, (err2) => {
          if (!err2) {
            callback(200, {
              msg: "Successfully deleted the Token data",
            });
          } else {
            callback(500, {
              error: "Could not delete the token from the database",
            });
          }
        });
      } else {
        callback(404, {
          error: "Could not find the token in the database",
        });
      }
    });
  } else {
    callback(500, {
      error: "Could not validate token",
    });
  }
};

handler._token.verify = (id, phoneNum, callback) => {
  data.read("token", id, (err, usrToken) => {
    if (!err) {
      if (
        parseJson(usrToken).phoneNum === phoneNum &&
        parseJson(usrToken).expire > Date.now()
      ) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
