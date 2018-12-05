const json2csv = require('json2csv').parse;
const fs = require('fs');

const path = require('path');
const remote = require('electron').remote
const app = remote.app;


exports.write = async function(json, id, task) {
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

    let appPath = app.getAppPath();
    let docPath = path.join(appPath+'/output/'+task+'/'+patientId+'_'+date+'.csv');
    fs.writeFile(docPath, csv, function(err, data){
      if (err) console.log(err);
      else {
        console.log("Successfully Written to File.");
        return "success";
      }
    });
  } catch(err) {
    console.log(err);
    console.log("Couldn't export to CSV");
    return "failed";
  }
}