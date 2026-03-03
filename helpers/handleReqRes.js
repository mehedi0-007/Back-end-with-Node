const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const { notFoundHandler } = require("../handlers/routes handlers/notFound");
const { parseJson } = require("./utilites");

const handle = {};

handle.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const queryString = parsedUrl.query;
  const method = req.method.toLowerCase();
  const headerObject = req.headers;

  const requestProperty = {
    parsedUrl,
    path,
    trimmedPath,
    queryString,
    method,
    headerObject,
  };

  let realData = "";
  const decoder = new StringDecoder("utf-8");

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  req.on("data", (dt) => {
    realData += decoder.write(dt);
  });

  req.on("end", () => {
    realData += decoder.end();

    requestProperty.body = parseJson(realData);

    chosenHandler(requestProperty, (statusCode, payLoad) => {
      const statuscode = typeof statusCode === "number" ? statusCode : 500;
      const payload = typeof payLoad === "object" ? payLoad : {};

      const payLoadString = JSON.stringify(payload);

      res.setHeader("Content-Type", "application/json");
      res.writeHead(statuscode);
      res.end(payLoadString);
    });
  });
};

module.exports = handle.handleReqRes;
