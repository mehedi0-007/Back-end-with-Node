const environments = {};

environments.staging = {
  port: 3000,
  envName: "Staging",
  secretKey : 'MehediHassan'
};

environments.production = {
  port: 5000,
  envName: "Production",
  secretKey : 'MH_007'
};

const curEnv =
  typeof process.env.ENV === "string" ? process.env.ENV : "staging";

const envToExport =
  typeof environments[curEnv] === "object"
    ? environments[curEnv]
    : environments.staging;

module.exports = envToExport;