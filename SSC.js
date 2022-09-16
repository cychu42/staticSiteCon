const fs = require("fs");
const readline = require("readline");
var argv = require('minimist')(process.argv.slice(2));//args using minimist, but ignore first 2
delete argv['_'];//this tool does not use it

const version="TXT-to-HTML Static Site Converter v0.1";//tool name and version when queried

var outputPath="./dist";//output path
var css="";//stylesheet url

//help description
const help="This is mainly a tool that covnerts txt files into static web pages.\n\
The user can provide one or more txt files to covnert into html file(s) of the same names.\n\
Use --input or -i to specify path to a txt file or a folder with txt files, and this tool will convert them into html files in 'dist' folder.\n\
If the dist folder doesn't exist at the current directory, one will be created.\n\
Example: node SSC -i ./test_files\n\n\
Other options:\n\
--version or -v\n\
This provides tool name and its version.\n\n\
--output or -o\n\
Use this to specify an output directory instead of the dist folder.\n\
Example: -o ./myFolder\n\n\
--stylesheet or -s\n\
Use this to specify url of the stylesheet to use.\n\
Example: -o https://cdnjs.cloudflare.com/ajax/libs/tufte-css/1.8.0/tufte.min.css\n\n\
--help or -h\n\
This shows the help guide.\n"

//main txt-to-html conversion function
function txtReader(source){
   const name=source.slice(source.lastIndexOf("/")+1,source.indexOf(".txt"));//for displaying message in the end
   const destination = outputPath+source.slice(source.lastIndexOf("/"),source.indexOf(".txt"))+".html";
   const inStream = fs.createReadStream(source);
   const outStream = fs.createWriteStream(destination, { encoding: "utf8" });
   const title=source.slice(source.lastIndexOf("/")+1,source.indexOf(".txt"));//set title
   
   //first half of html
   var htmlStart=`<!doctype html>\n\
<html lang="en">\n\
<head>\n\
  <meta charset="utf-8">\n\
  <title>${title}</title>\n\
  <meta name="viewport" content="width=device-width, initial-scale=1">\n\
${css}\
</head>\n\
<body>\n`;

   //interface
   var reader = readline.createInterface({
     input: inStream,
     terminal: false
   });

   //write the starting part
   outStream.write(htmlStart);

   //change to each line
   reader.on("line", function(line) {
      if(line.trim()==""){
         outStream.write(" \n");
      }
      else{
         outStream.write("  <p>"+line+"</p>\n");
      }
   });

   //write the ending part when there's no more
   reader.on("close", function() {
      outStream.write("</body>\n</html>\n");
   });

   console.log(`${name}.html`);//part of message for what's created
}



/**-------------------execute different things depending on args-------------------*/
//==ask for version==
if(argv.version || argv.v){
   console.log(version);
}

//==help==
if(argv.help || argv.h){
   console.log(help);//update hlep as you go<=====1
}

//==specify output==
if(argv.output || argv.o){
   outputPath=(argv.output || argv.o)+"";
   fs.access(outputPath, function(err) {//check if the directory exist
      if (err && err.code === 'ENOENT') {
        console.log("Invalid directory path! Program stopped.");
      }
   });
   return;//stop the program
}

//==specify stylesheet==
if(argv.stylesheet || argv.s){
   css=`  <link rel="stylesheet" href="${(argv.stylesheet || argv.s)+""}">\n`;
}



//==when one or more file are provided, convert them to html==
if(argv.input || argv.i){
   console.log("Created output file(s):")//part of message for what's created

   const source = (argv.input || argv.i)+""; 
   let outputed=false;//flag for whether any output is created

   fs.promises.mkdir(outputPath, { recursive: true });//create directory

   if(source.slice(-4)==".txt"){//only 1 file
      txtReader(source);
   }
   else{//a directory
      fs.readdir(source, (err, files)=>{
         try{
            files.forEach(file=>{
               if(file.slice(-4)==".txt"){//only select txt files
                  txtReader(source+"/"+file);
                  outputed=true;
               }               
            });
            if(files.length==0){//for the case of source folder being empty
               console.log("Invalid source. Source folder is empty!");
               return;
            }else if(outputed==false){
               console.log("Invalid source. Please have txt file(s) in the folder.");//for the case of source folder being valid with no txt file inside
            }
         }catch(e){
            console.log("Invalid source. Please ensure source is valid and exists.");//if source doesn't exist or is invalid, will throw error and come here
         }      
      });
   }
}

//check for option validity
if(Object.keys(argv).length==0){
   console.log("No valid option used. Check README.md or use -help/-h option for details.");
}
else{
   for(const [key, value] of Object.entries(argv)){
      if(!(key=="v" || key=="version" || key=="h" || key=="help" || key=="o" || key=="output" || key=="s" || key=="stylesheet" || key=="i" || key=="input" )){
         console.log("Invalid option used. Check README.md or use -help/-h option for details.");
         return;
      }
   }
}

//test only, please delete later<=====2
console.log(argv);