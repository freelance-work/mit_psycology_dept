const json2csv = require('json2csv').parse;
const { dialog } = require('electron').remote;
const fs = require('fs');
const mkdirp = require('async-mkdirp');
const os = require('os');
const path = require('path');


exports.write = async function (json, id, task, fields) {
  try {
    let opts = {fields};

    const csv = json2csv(json, opts);

    let patientId = id;

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!

    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    let date = dd + '-' + mm + '-' + yyyy;
    let fileName = patientId + '_' + date + '_' + task + '.csv';

    return new Promise(function (resolve, reject) {
      dialog.showSaveDialog({ defaultPath: fileName }, (filePath) => {
        fs.writeFile(filePath, csv, (err) => {
          if (err) reject(err);
          else {
            resolve("success");
          }
        });
      });
    });

  } catch (err) {
    return "failed";
  }
}