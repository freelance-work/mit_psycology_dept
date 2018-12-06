const json2csv = require('json2csv').parse;
const fs = require('fs');
const mkdirp = require('async-mkdirp');

const path = require('path');


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
    let outputPath = '';
    if(process.platform == 'win32'){
      outputPath = 'C:/APCO'
    }

    let docPath = path.join(outputPath+'/output/'+task);

    await mkdirp(docPath);

    return new Promise(function(resolve, reject) {
      fs.writeFile(docPath+'/'+patientId+'_'+date+'.csv', csv, (err, data) => {
        if (err) reject(err);
        else {
          console.log("Successfully Written to File.");
          resolve("success");
        }
      });
    });

  } catch(err) {
    console.log(err);
    console.log("Couldn't export to CSV");
    return "failed";
  }
}