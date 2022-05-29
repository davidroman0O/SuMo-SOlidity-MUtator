const fs = require("fs");
const os = require("os");
const readline = require('readline');
const rimraf = require('rimraf')
const fsExtra = require("fs-extra");
const config = require("./config");
const glob = require("glob");
const path = require("path");
const sumoDir = config.sumoDir;
const baselineDir = config.baselineDir;
const contractsDir = config.contractsDir;
const contractsGlob = config.contractsGlob;

/**
 * deletes the .sumo folder
 */
function cleanSumo() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  if (!fs.existsSync(sumoDir)) {
    console.log("Nothing to delete")
    process.exit(0)
  }
  rl.question("If you delete the '.sumo' directory you will lose the mutation testing data. Do you want to proceed? y/n > ", function (response) {
    response = response.trim()
    response = response.toLowerCase()
    if (response === 'y' || response === 'yes') {
      fsExtra.remove(sumoDir);
      console.log("'.sumo directory' deleted!")
      rl.close()
    }
    else {
      rl.close()
    }
  })
}


/**
 * restores the SUT files
 */
function restore() {

  if (fs.existsSync(baselineDir)) {

     glob(baselineDir + contractsGlob, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        let relativeFilePath = file.split(".sumo/baseline")[1];
        let fileDir = path.dirname(relativeFilePath);
        fs.mkdir(contractsDir + fileDir, { recursive: true }, function (err) {
          if (err) return cb(err);

          fs.copyFile(file, contractsDir + relativeFilePath, (err) => {
            if (err) throw err;
          });
        });
      }
    });
    console.log("Project restored.");
  } else {
    console.log("No baseline available.");
  }
}

/**
 * Cleans the temporary files generated by Ganache
 */
   function cleanTmp() {
    var dir = os.tmpdir();
    fs.readdirSync(dir).forEach(f => {
      if (f.substring(0, 4) === 'tmp-') {
        rimraf.sync(`${dir}/${f}`)
        //console.log(f + ' deleted')
      }
    });
    console.log("Ganache temporary files deleted.");
  }


module.exports = {
  cleanSumo: cleanSumo,
  restore:restore,
  cleanTmp: cleanTmp
};
