const fs = require("fs");
const readline = require("readline");
const path = require("path");
const { startHtml, closeHtml } = require("./htmlFormat.js");

//set up elements to be used in a parser(txtParser() and mdParser())
function parserSetup(source, outputPath, css, lang, ext) {
  const name = path.basename(source, ext); //for displaying message in the end
  const destination = outputPath + "/" + name + ".html";
  const inStream = fs.createReadStream(source);
  const outStream = fs.createWriteStream(destination, { encoding: "utf8" });
  const title = name; //set title; can be anything else if desires later

  //first half of html
  let htmlStart = startHtml(title, css, lang);

  //interface
  let reader = makeInterface(inStream);

  //write the starting part
  outStream.write(htmlStart);

  return { name, outStream, reader };
}

//configure interface for reader
function makeInterface(inStream) {
  return readline.createInterface({
    input: inStream,
    terminal: false,
  });
}

//main txt-to-html conversion function
function txtParser(source, outputPath, css, lang) {
  let setup = parserSetup(source, outputPath, css, lang, ".txt");
  let name = setup.name;
  let outStream = setup.outStream;
  let reader = setup.reader;

  let lineClosed = true; //whether line is closed with </p>
  //change to each line
  reader.on("line", function (line) {
    if (line.trim() == "") {
      if (lineClosed == false) {
        outStream.write("</p>\n\n");
        lineClosed = true;
      } else {
        outStream.write("\n");
      }
    } else {
      if (lineClosed == true) {
        outStream.write("  <p>" + line);
        lineClosed = false;
      } else {
        outStream.write(" " + line);
      }
    }
  });

  closeHtml(reader, outStream, name);
}

function mdParser(source, outputPath, css, lang) {
  let setup = parserSetup(source, outputPath, css, lang, ".md");
  let name = setup.name;
  let outStream = setup.outStream;
  let reader = setup.reader;

  let lineClosed = true; //whether line is closed with </p>
  let boldClosed = true;
  //change to each line
  reader.on("line", function (line) {
    //parse links
    line = line.replaceAll(/\[(.*?)\]\((.*?)\)/g, "<a href=$2>$1</a>");

    // Bold text parsing
    while (line.includes("__") || line.includes("**")) {
      if (boldClosed) {
        line = line.replace("__", "<b>");
        line = line.replace("**", "<b>");
        boldClosed = false;
        if (line.match(/__/)) {
          line = line.replace("__", "</b>");
          boldClosed = true;
        }
        if (line.match(/\*\*/)) {
          line = line.replace("**", "</b>");
          boldClosed = true;
        }
      }
      if (!boldClosed) {
        if (line.match(/__/)) {
          line = line.replace("__", "</b>");
          boldClosed = true;
        }
        if (line.match(/\*\*/)) {
          line = line.replace("**", "</b>");
          boldClosed = true;
        }
      }
    }

    // parse any --- into <hr>
    line = line.replaceAll(/-{3,}/g, "<hr>");

    if (line.trim() == "") {
      if (lineClosed == false) {
        outStream.write("</p>\n\n");
        lineClosed = true;
      } else {
        outStream.write("\n");
      }
    } else {
      if (line == "<hr>") {
        //if it's just a tag, write as it is; only has <hr> so far, but this can expand later
        outStream.write("  " + line + "\n");
      } else if (lineClosed == true) {
        outStream.write("  <p>" + line);
        lineClosed = false;
      } else {
        outStream.write(" " + line);
      }
    }
  });

  closeHtml(reader, outStream, name);
}

module.exports = {
  txtParser,
  mdParser,
};
