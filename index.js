const http = require("http");
const ReqRes = require("./helpers/handleReqRes");
const environments = require("./helpers/environment");

const app = {};

app.handleReqRes = ReqRes;

app.serverRun = () => {
  const server = http.createServer(app.handleReqRes);

  server.listen(environments.port, () => {
    console.log(`Server is running in port ${environments.port}`);
    console.log(`Currently this project is in ${environments.envName} state`);
  });
};

app.serverRun();
