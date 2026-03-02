const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const { notFoundHandler } = require("../handlers/routes handlers/notFound");

const handle = {};

handle.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const queryString = parsedUrl.query;
  const method = req.method.toLowerCase();
  const headerObject = req.headers;

  const handlerProperty = {
    parsedUrl,
    path,
    trimmedPath,
    queryString,
    method,
    headerObject,
  };

  let data = "";
  const decoder = new StringDecoder("utf-8");

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  chosenHandler(handlerProperty, (statusCode, payLoad) => {
    const statuscode = typeof statusCode === "number" ? statusCode : 500;
    const payload = typeof payLoad === "object" ? payLoad : {};

    const payLoadString = JSON.stringify(payload);

    res.writeHead(statuscode);
    res.end(payLoadString);
  });

  req.on("data", (dt) => {
    data += decoder.write(dt);
  });

  req.on("end", () => {
    console.log("\n" + data + "\n");

    console.log(trimmedPath);
    data += decoder.end();
    res.end("Data Recieved");
  });
};

module.exports = handle.handleReqRes;
