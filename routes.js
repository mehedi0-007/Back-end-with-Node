const { sampleHandler } = require("./handlers/routes handlers/sampleHandlers");
const { notFoundHandler } = require("./handlers/routes handlers/notFound");

const routes = {
  sample: sampleHandler,
  notFound: notFoundHandler,
};

module.exports = routes;
