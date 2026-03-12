const data = require("../../lib/data");
const { encrypt, parseJson } = require("../../helpers/utilites");
const tokenHandler = require("./tokenHandler");

const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const accMethods = ["get", "put", "post", "delete"];

  if (accMethods.indexOf(requestProperties.method) > -1) {
    handler._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._user = {};

handler._user.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  const toAgreement =
    typeof requestProperties.body.toAgreement === "boolean"
      ? requestProperties.body.toAgreement
      : false;

  if (firstName && lastName && phoneNum && password && toAgreement) {
    data.read("user", phoneNum, (err) => {
      if (err) {
        let userData = {
          firstName,
          lastName,
          phoneNum,
          password: encrypt(password),
          toAgreement,
        };

        data.create("user", phoneNum, userData, (err2) => {
          if (!err2) {
            callback(200, {
              msg: "User created successfully",
            });
          } else {
            callback(500, {
              error: "Could not create this user into the database",
            });
          }
        });
      } else {
        callback(500, {
          error: "This user already exists in the server",
        });
      }
    });
  } else {
    callback(500, {
      error: `Couldn't validate the user data`,
    });
  }
};

handler._user.get = (requestProperties, callback) => {
  const phoneNum =
    typeof requestProperties.queryString.phoneNum === "string" &&
    requestProperties.queryString.phoneNum.trim().length === 11
      ? requestProperties.queryString.phoneNum
      : false;

  if (phoneNum) {
    let id =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;
    tokenHandler._token.verify(id, phoneNum, (err) => {
      if (err) {
        data.read("user", phoneNum, (err, user) => {
          const userData = { ...parseJson(user) };
          if (!err && userData) {
            delete userData.password;
            callback(200, userData);
          } else {
            callback(404, {
              error: "Could not find the user in the database",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication failed",
        });
      }
    });
  } else {
    callback(404, {
      error: "Could not validate user",
    });
  }
};

handler._user.put = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  if (phoneNum) {
    if (firstName || lastName || password) {
      let id =
        typeof requestProperties.headerObject.token === "string"
          ? requestProperties.headerObject.token
          : false;
      tokenHandler._token.verify(id, phoneNum, (err) => {
        if (err) {
          data.read("user", phoneNum, (err, user) => {
            const userData = { ...parseJson(user) };
            if (!err) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = encrypt(password);
              }

              data.update("user", phoneNum, userData, (err) => {
                if (!err) {
                  callback(200, {
                    msg: "Successfully updated the user data",
                  });
                } else {
                  callback(500, {
                    error: "Could not update the user data",
                  });
                }
              });
            } else {
              callback(404, {
                error: "Could not find the user in the database",
              });
            }
          });
        } else {
          callback(403, {
            error: "Authentication failed",
          });
        }
      });
    } else {
      callback(404, {
        error: "Nothing found to update ",
      });
    }
  } else {
    callback(404, {
      error: "Invalid phone number",
    });
  }
};

handler._user.delete = (requestProperties, callback) => {
  const phoneNum =
    typeof requestProperties.queryString.phoneNum === "string" &&
    requestProperties.queryString.phoneNum.trim().length === 11
      ? requestProperties.queryString.phoneNum
      : false;

  if (phoneNum) {
    let id =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;
    tokenHandler._token.verify(id, phoneNum, (err) => {
      if (err) {
        data.read("user", phoneNum, (err, user) => {
          if (!err) {
            data.delete("user", phoneNum, (err2) => {
              if (!err2) {
                callback(200, {
                  msg: "Successfully deleted the user data",
                });
              } else {
                callback(500, {
                  error: "Could not delete the user from the database",
                });
              }
            });
          } else {
            callback(404, {
              error: "Could not find the user in the database",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication failed",
        });
      }
    });
  } else {
    callback(500, {
      error: "Could not validate user",
    });
  }
};

module.exports = handler;
