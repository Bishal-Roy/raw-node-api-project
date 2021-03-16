const fs = require("fs");
const path = require("path");

const lib = {};

lib.basedir = path.join(__dirname, "/../.data/");

//write data to file

lib.create = function (dir, file, data, callback) {
  fs.open(
    `${lib.basedir + dir}/${file}.json`,
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);

        fs.writeFile(fileDescriptor, stringData, function (err) {
          if (!err) {
            fs.close(fileDescriptor, function (err) {
              if (!err) {
                callback(false);
              } else {
                callback("error writing to new file");
              }
            });
          } else {
            callback("error writing to newe file");
          }
        });
      } else {
        callback("could not create new file, it may already exist");
      }
    }
  );
};

//read data from file

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf-8", (err, data) => {
    callback(err, data);
  });
};

//update existing file

lib.update = (dir, file, data, callback) => {
  fs.open(
    `${lib.basedir + dir}/${file}.json`,
    "r+",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);
        fs.ftruncate(fileDescriptor, (err) => {
          if (!err) {
            fs.writeFile(fileDescriptor, stringData, (err) => {
              if (!err) {
                fs.close(fileDescriptor, (err) => {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("error cloing file");
                  }
                });
              } else {
                callback("error writing to file");
              }
            });
          } else {
            console.log("error truncating file");
          }
        });
      } else {
        console.log(`error upadating. file may not exist`);
      }
    }
  );
};

//delete existing file

lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(`error deleting file`);
    }
  });
};

lib.list = (dir, callback) => {
  fs.readdir(`${lib.basedir + dir}/`, (err, fileNames) => {
      if (!err && fileNames && fileNames.length > 0) {
          const trimmedFileNames = [];
          fileNames.forEach((fileName) => {
              trimmedFileNames.push(fileName.replace('.json', ''));
          });
          callback(false, trimmedFileNames);
      } else {
          callback('Error reading directory!');
      }
  });
};

module.exports = lib;
