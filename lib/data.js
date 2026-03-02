const fs = require("fs");
const path = require("path");

const lib = {};

lib.basedir = path.join(__dirname, "/../.data/");

lib.create = (dir, file, data, callback) => {
  fs.open(lib.basedir + dir + "/" + file + ".JSON", "wx", (err, fileDes) => {
    if (!err && fileDes) {
      const stringData = JSON.stringify(data);
      fs.write(fileDes, stringData, (err2) => {
        if (!err2) {
          fs.close(fileDes, (err3) => {
            if (!err3) {
              callback("Successfully created and written in the file");
            } else {
              callback("Error failed to close the file");
            }
          });
        } else {
          callback("Error failed to write in the file");
        }
      });
    } else {
      callback("Error failed to open file");
    }
  });
};

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.JSON`, "utf8", (err, data) => {
    callback(err, data);
  });
};

module.exports = lib;
