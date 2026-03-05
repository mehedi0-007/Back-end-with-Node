const { sampleHandler } = require("./handlers/routes handlers/sampleHandlers");
const { notFoundHandler } = require("./handlers/routes handlers/notFound");
const { userHandler } = require("./handlers/routes handlers/userHandlers");
const { tokenHandler } = require("./handlers/routes handlers/tokenHandler");

const routes = {
  sample: sampleHandler,
  notFound: notFoundHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;
