const http = require("http");
const ReqRes = require("./helpers/handleReqRes");
const environments = require("./helpers/environment");
const data = require("./lib/data");

const app = {};

app.handleReqRes = ReqRes;

// data.create(
//   "test",
//   "newData",
//   {
//     Name: "Mehedi",
//     Position: "Backend Developer",
//   },
//   (err) => {
//     console.log(err);
//   },
// );

data.read("test", "newData", (err, readData) => {
  console.log(readData);
});

app.serverRun = () => {
  const server = http.createServer(app.handleReqRes);

  server.listen(environments.port, () => {
    console.log(`Server is running in port ${environments.port}`);
    console.log(`Currently this project is in ${environments.envName} state`);
  });
};

app.serverRun();
