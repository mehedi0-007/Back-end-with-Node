const http = require("http");
const ReqRes = require("./helpers/handleReqRes");

const app = {};

app.serverConfig = {
  port: 3000,
};

app.serverRun = () => {
  const server = http.createServer(app.handleReqRes);

  server.listen(app.serverConfig.port, () => {
    console.log(`Server is running in port ${app.serverConfig.port}`);
  });
};

app.handleReqRes = ReqRes;

app.serverRun();
