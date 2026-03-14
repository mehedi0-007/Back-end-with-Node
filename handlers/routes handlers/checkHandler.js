const data = require("../../lib/data");
const { encrypt, parseJson, createToken } = require("../../helpers/utilites");
const tokenHandler = require("./tokenHandler");
const { maxChecks } = require("../../helpers/environment");

const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const accMethods = ["get", "put", "post", "delete"];

  if (accMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
  const reqBody = requestProperties.body;

  let protocol =
    typeof reqBody.protocol === "string" &&
    ["http", "https"].indexOf(reqBody.protocol) > -1
      ? reqBody.protocol
      : false;

  let url =
    typeof reqBody.url === "string" && reqBody.url.trim().length > 0
      ? reqBody.url
      : false;

  let method =
    typeof reqBody.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(reqBody.method) > -1
      ? reqBody.method
      : false;

  let successCodes =
    typeof reqBody.successCodes === "object" &&
    reqBody.successCodes instanceof Array
      ? reqBody.successCodes
      : false;

  let timeOutSeconds =
    typeof reqBody.timeOutSeconds === "number" &&
    reqBody.timeOutSeconds % 1 === 0 &&
    reqBody.timeOutSeconds >= 1 &&
    reqBody.timeOutSeconds <= 5
      ? reqBody.timeOutSeconds
      : false;

  if (protocol && url && method && successCodes && timeOutSeconds) {
    let token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;

    if (token) {
      data.read("token", token, (err, usrToken) => {
        if (!err) {
          let phoneNum = parseJson(usrToken).phoneNum;

          data.read("user", phoneNum, (err2, usrData) => {
            if (!err2) {
              tokenHandler._token.verify(token, phoneNum, (err3) => {
                if (err3) {
                  let usrObject = parseJson(usrData);
                  let usrChecks =
                    typeof usrObject.checks === "object" &&
                    usrObject.checks instanceof Array
                      ? usrObject.checks
                      : [];

                  if (usrChecks.length < maxChecks) {
                    let checksId = createToken(10);
                    let checksObj = {
                      id: checksId,
                      phoneNum,
                      protocol,
                      url,
                      method,
                      successCodes,
                      timeOutSeconds,
                    };
                    data.create("checks", checksId, checksObj, (err4) => {
                      if (!err4) {
                        usrObject.checks = usrChecks;
                        usrObject.checks.push(checksId);

                        data.update("user", phoneNum, usrObject, (err5) => {
                          if (!err5) {
                            callback(200, {
                              msg: "Checks created and here is the result: ",
                              checks: checksObj,
                            });
                          } else {
                            callback(500, {
                              error: "Could not update the user",
                            });
                          }
                        });
                      } else {
                        callback(500, {
                          error: "Server side error",
                        });
                      }
                    });
                  } else {
                    callback(404, {
                      error: "User reached max checks",
                    });
                  }
                } else {
                  callback(403, {
                    error: "Authenticaion failed ",
                  });
                }
              });
            } else {
              callback(403, {
                error: "User not found",
              });
            }
          });
        } else {
          callback(403, {
            error: "Token not found",
          });
        }
      });
    } else {
      callback(403, {
        erorr: "Invalid token found",
      });
    }
  } else {
    callback(403, {
      error: "You have a problem in your request",
    });
  }
};

handler._check.get = (requestProperties, callback) => {
  let id =
    typeof requestProperties.queryString.id === "string"
      ? requestProperties.queryString.id
      : false;

  if (id) {
    data.read("checks", id, (err, checksData) => {
      if (!err) {
        let token =
          typeof requestProperties.headerObject.token === "string"
            ? requestProperties.headerObject.token
            : false;

        tokenHandler._token.verify(
          token,
          parseJson(checksData).phoneNum,
          (err) => {
            if (err) {
              callback(200, parseJson(checksData));
            } else {
              callback(404, {
                error: "Authentication failed",
              });
            }
          },
        );
      } else {
        callback(403, {
          error: "Checks not found in database",
        });
      }
    });
  } else {
    callback(403, {
      error: "Token not found in request",
    });
  }
};

handler._check.put = (requestProperties, callback) => {
  let id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.length === 20
      ? requestProperties.body.id
      : false;

  const reqBody = requestProperties.body;

  let protocol =
    typeof reqBody.protocol === "string" &&
    ["http", "https"].indexOf(reqBody.protocol) > -1
      ? reqBody.protocol
      : false;

  let url =
    typeof reqBody.url === "string" && reqBody.url.trim().length > 0
      ? reqBody.url
      : false;

  let method =
    typeof reqBody.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(reqBody.method) > -1
      ? reqBody.method
      : false;

  let successCodes =
    typeof reqBody.successCodes === "object" &&
    reqBody.successCodes instanceof Array
      ? reqBody.successCodes
      : false;

  let timeOutSeconds =
    typeof reqBody.timeOutSeconds === "number" &&
    reqBody.timeOutSeconds % 1 === 0 &&
    reqBody.timeOutSeconds >= 1 &&
    reqBody.timeOutSeconds <= 5
      ? reqBody.timeOutSeconds
      : false;

  if (id) {
    data.read("checks", id, (err, checkData) => {
      if (!err) {
        if (protocol || method || successCodes || url || timeOutSeconds) {
          const chk = parseJson(checkData);

          let token =
            typeof requestProperties.headerObject.token === "string"
              ? requestProperties.headerObject.token
              : false;

          if (token) {
            tokenHandler._token.verify(token, chk.phoneNum, (err) => {
              if (err) {
                if (protocol) {
                  chk.protocol = protocol;
                }
                if (url) {
                  chk.url = url;
                }
                if (method) {
                  chk.method = method;
                }
                if (successCodes) {
                  chk.successCodes = successCodes;
                }
                if (timeOutSeconds) {
                  chk.timeOutSeconds = timeOutSeconds;
                }

                data.update("checks", id, chk, (err) => {
                  if (!err) {
                    callback(200, {
                      msg: "Successfully updated the check",
                      check: chk,
                    });
                  } else {
                    callback(404, {
                      error: "Server could not update the checks",
                    });
                  }
                });
              } else {
                callback(404, {
                  error: "Authenticatoin failed",
                });
              }
            });
          } else {
            callback(404, {
              eroor: "Token not found",
            });
          }
        } else {
          callback(403, {
            error: "You have to provide at least one update parameter",
          });
        }
      } else {
        callback(404, {
          error: "Could not find the check",
        });
      }
    });
  } else {
    callback(403, {
      error: "You have a problem in your request",
    });
  }
};

handler._check.delete = (requestProperties, callback) => {
  let chekId =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.length === 20
      ? requestProperties.body.id
      : false;

  if (chekId) {
    data.read("checks", chekId, (err, checkData) => {
      if (!err) {
        let token =
          typeof requestProperties.headerObject.token === "string"
            ? requestProperties.headerObject.token
            : false;

        tokenHandler._token.verify(
          token,
          parseJson(checkData).phoneNum,
          (err) => {
            if (err) {
              data.delete("checks", chekId, (err) => {
                if (!err) {
                  callback(200, {
                    msg: "Successfully deleted the check",
                  });
                } else {
                  callback(404, {
                    error: "Serverside error",
                  });
                }
              });
            } else {
              callback(404, {
                error: "Authentication failed",
              });
            }
          },
        );
      } else {
        callback(403, {
          error: "Checks not found in server",
        });
      }
    });
  } else {
    callback(403, {
      error: "You have a problem in your request",
    });
  }
};

module.exports = handler;
