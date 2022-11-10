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

//made to shorten the code and expose the core parser functionality for testing
function txtLineParser(line, lineClosed) {
  let toWrite;

  if (line.trim() == "") {
    if (lineClosed == false) {
      toWrite = "</p>\n\n";
      lineClosed = true;
    } else {
      toWrite = "\n";
    }
  } else {
    if (lineClosed == true) {
      toWrite = "  <p>" + line;
      lineClosed = false;
    } else {
      toWrite = " " + line;
    }
  }

  return { toWrite: toWrite, lineClosed: lineClosed };
}

//main txt-to-html conversion function
function txtParser(source, outputPath, css, lang) {
  let setup = parserSetup(source, outputPath, css, lang, ".txt");
  let name = setup.name;
  let outStream = setup.outStream;
  let reader = setup.reader;

  let lineClosed = true; //whether line is closed with </p>
  //for each line, parse and return whether the line is cloosed
  reader.on("line", function (line) {
    let result = txtLineParser(line, lineClosed);

    lineClosed = result.lineClosed;
    outStream.write(result.toWrite);
  });

  closeHtml(reader, outStream, name);
}

function mdLineParser(line, lineClosed, boldClosed) {
  let toWrite;

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
      toWrite = "</p>\n\n";
      lineClosed = true;
    } else {
      toWrite = "\n";
    }
  } else {
    if (line == "<hr>") {
      //if it's just a tag, write as it is; only has <hr> so far, but this can expand later
      toWrite = "  " + line + "\n";
    } else if (lineClosed == true) {
      toWrite = "  <p>" + line;
      lineClosed = false;
    } else {
      toWrite = " " + line;
    }
  }

  return {
    toWrite: toWrite,
    lineClosed: lineClosed,
    boldClosed: boldClosed,
  };
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
    let result = mdLineParser(line, lineClosed, boldClosed);

    lineClosed = result.lineClosed;
    boldClosed = result.boldClosed;
    outStream.write(result.toWrite);
  });

  closeHtml(reader, outStream, name);
}

module.exports = {
  txtParser,
  mdParser,
  txtLineParser,
  mdLineParser,
};
