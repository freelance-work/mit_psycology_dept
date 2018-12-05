const json2csv = require('json2csv');
const fs = require('fs');

const electron =  require('electron');
const { ipcRenderer } = electron;

const {
  GET_PATIENT_FROM_STORAGE,
} = require('./constants');

exports.write = async function(json) {
  try {
    const csv = json2csv(json);

    let patientId;

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

    await ipcRenderer.send(GET_PATIENT_FROM_STORAGE, (e, res) => {
      if(res.success) {
        patientId = res.id;
      }
    });

    fs.writeFile(patientId+date+'.csv', csv, function(err, data){
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });
  }
}