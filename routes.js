const { sampleHandler } = require("./handlers/routes handlers/sampleHandlers");
const { notFoundHandler } = require("./handlers/routes handlers/notFound");
const { userHandler } = require("./handlers/routes handlers/userHandlers");
const { tokenHandler } = require("./handlers/routes handlers/tokenHandler");
const {checkHandler} = require("./handlers/routes handlers/checkHandler");

const routes = {
  sample: sampleHandler,
  notFound: notFoundHandler,
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};

module.exports = routes;
