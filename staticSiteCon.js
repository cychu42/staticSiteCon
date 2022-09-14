const fs = require("fs");
const readline = require("readline");

function txtReader(txt){
    const source = txt;//the source txt file
    const destination = txt.replace('txt', 'html');//have the new file be html but keep the name
    const inStream = fs.createReadStream(source);
    const outStream = fs.createWriteStream(destination, { encoding: "utf8" });

    //interface
    var reader = readline.createInterface({
      input: inStream,
      terminal: false
    });

    //change to each line
    reader.on("line", function(line) {
     if(line.trim()==""){
        outStream.write(" \n");
     }
     else{
        outStream.write("<p>"+line+"</p>\n");
     }
      
    });
}

txtReader("../files/input.txt");
//make it accept single or multiple files(folder)
//consider omit the soruce = txt step
