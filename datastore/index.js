const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
  // call the refractored getNextUniqueId
  // takes two inputs for readCounter: error for failed and counter
  counter.getNextUniqueId((err, id) => {
    // acquire the path to write the data
    var filePath = path.join(exports.dataDir, `${id}.txt`)
    // the parent function already contains a callback
    // write the counter to the newly create file
    fs.writeFile(filePath, text, (err /*callback*/) => {
      if (err) {
        // throw error message if occurs
        callback(err);
      } else {
        // else, return the supplied data
        callback(null, {id, text});
      }
    })
  })
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      return callback(err);
    }
    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      return {
        id: id,
        text: id
      }
    });
    callback(null, data)
  });
};

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, (err, text) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        id: id,
        text: text.toString()
      })
    }
  })
};

exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);

  const flag = fs.constants.O_WRONLY | fs.constants.O_TRUNC;

  fs.writeFile(filePath, text, {flag}, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id: id, text: text});
    }
  });
};

exports.delete = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);

  fs.unlink(filePath, (err) => {
    callback(err);
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
