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

lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.basedir + dir}/${file}.JSON`, "r+", (err, fileDes) => {
    if (!err && fileDes) {
      const stringData = JSON.stringify(data);
      fs.ftruncate(fileDes, (err2) => {
        if (!err2) {
          fs.writeFile(fileDes, stringData, (err3) => {
            if (!err3) {
              fs.close(fileDes, (err4) => {
                if (!err4) {
                  callback("Successfully updated the file");
                } else {
                  callback("Error failed to close the file");
                }
              });
            } else {
              callback("Error failed to write the updated file");
            }
          });
        } else {
          callback("Error failed to delete the existing file for update");
        }
      });
    } else {
      callback("Error failed to open the file");
    }
  });
};

lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.basedir + dir}/${file}.JSON`, (err) => {
    if (!err) {
      callback("Successfully deleted the file");
    } else {
      callback("Error failed to delete the file");
    }
  });
};

module.exports = lib;
