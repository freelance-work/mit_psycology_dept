const json2csv = require('json2csv');
const fs = require('fs');

const electron =  require('electron');
const { ipcRenderer } = electron;


exports.write = async function(json, id) {
  try {
    const csv = json2csv(json);

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

    fs.writeFile('emo_recognition_'+patientId+'_'+date+'.csv', csv, function(err, data){
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });
  } catch(err) {
    console.log("Couldn't export to CSV");
    return "failed";
  }
}