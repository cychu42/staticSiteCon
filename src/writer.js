const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const { txtParser, mdParser } = require("./parser.js");

//convert one or more file are provided to html file(s)
function writer(outputPath, source, css, lang) {
  let outputed = false; //flag for whether any output is created

  //check if the directory exist
  try {
    fs.accessSync(outputPath, fs.constants.F_OK);
    if (outputPath.localeCompare("./dist")) {
      //if outputing to an existing user-specified folder
      fs.promises.mkdir(outputPath, { recursive: true });
      console.log("Output file(s):");
    }
  } catch (e) {
    console.log(
      "Error! Specified output directory doesn't exist, so default back to ./dist folder."
    );
    outputPath = "./dist";
  }

  //check if dist folder exist; if so, delete before creating it
  try {
    fs.accessSync("./dist", fs.constants.F_OK);
    if (!outputPath.localeCompare("./dist")) {
      fs.rmSync(outputPath, { recursive: true });
      console.log("Old dist folder deleted.");
      fs.promises.mkdir(outputPath, { recursive: true });
      console.log("New dis folder created. Output file(s):");
    }
  } catch (e) {
    if (!outputPath.localeCompare("./dist")) {
      fs.promises.mkdir(outputPath, { recursive: true });
      console.log("New dis folder created. Output file(s):");
    }
  }

  //----------actual writing----------
  let sourceExtension = path.extname(source);
  //only 1 input file
  if (sourceExtension == ".txt") {
    txtParser(source, outputPath, css, lang);
  } else if (sourceExtension == ".md") {
    mdParser(source, outputPath, css, lang);
  }
  //a directory as input
  else {
    fs.readdir(source, (err, files) => {
      try {
        files.forEach((file) => {
          let extension = path.extname(file);
          if (extension == ".txt") {
            //only select txt files
            txtParser(source + "/" + file, outputPath, css, lang);
            outputed = true;
          } else if (extension == ".md") {
            mdParser(source + "/" + file, outputPath, css, lang);
            outputed = true;
          }
        });

        if (files.length == 0) {
          //for the case of source folder being empty
          console.log("Invalid source. Source folder is empty!");
        } else if (outputed == false) {
          console.log(
            "Invalid source. Please have txt/md file(s) in the folder."
          ); //for the case of source folder being valid with no txt file inside
        }
      } catch (e) {
        console.log(
          "Invalid source. Please ensure source is valid and exists."
        ); //if source doesn't exist or is invalid, will throw error and come here
      }
    });
  }
}

//copy static folder content into a static folder in output folder
function staticFileHandler(staticPath, outputPath) {
  fs.readdir(staticPath, (err, files) => {
    try {
      if (files.length == 0) {
        //for the case of source folder being empty
        console.log("No static files found in the static folder.");
      } else {
        fse.copySync(`${staticPath}`, `${outputPath}/static`);
      }
    } catch (e) {
      console.log("No valid static folder found."); //if source doesn't exist or is invalid, will throw error and come here
    }
  });
}

module.exports = {
  writer,
  staticFileHandler,
};
