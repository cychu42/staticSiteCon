const fs = require("fs");
const readline = require("readline");
const path = require("path");
var argv = require('minimist')(process.argv.slice(2));//args using minimist, but ignore first 2
delete argv['_'];//this tool does not use it

const { version } = require("./package.json");//version

var valid=true;//validity of options
var outputPath="./dist";//output path
var css="";//stylesheet url
var lang="en-CA";//language of the HTML files

//help description
const help=
"## Goal\n\
This is mainly a tool that converts TXT files into static web pages. Additionally, Markdown(MD) files will also get converted into HTML.  Any bold text in the MD file will also appear bold in the HTML file.\n\n\
\
## Requirment\n\
Please first have Node.js installed on your machine. After downloading this tool, please run command 'npm i' in command line(such as cmd or PowerShell) while inside the tools directory to install required npm package(s).\n\n\
\
## Usage\n\
The user can provide one or more TXT/MD files to convert into HTML file(s) of the same names.\n\
Sample test files are in 'test_files' folder.\n\
This tool is run by entering commands in command line.\n\n\
\
Use '--input' or '-i' to specify path to a TXT/MD file or a folder with TXT/MD files, and this tool will convert them into HTML files in 'dist' folder.\n\
If the dist folder doesn't exist at the current directory, one will be created. If it exist, it will be deleted first to clean old output before being recreated.\n\
Example: node SSC -i ./test_files\n\n\
\
If you path has spaces for a file or folder, please use '' around the name(s).\n\
Example: node SSC -i ./'a folder with space in the name'\n\n\
\
## Other options:\n\
'--version' or '-v'\n\
This provides tool name and its version.\n\n\
\
'--output' or '-o'\n\
Use this to specify an output directory instead of the dist folder. If the directory is invalid, output directory is set back to the default.\n\
For safety, the directory specified by this option is never deleted by the tool.\n\
Example: -o ./myFolder \n\n\
\
'--stylesheet' or '-s'\n\
Use this to specify url of the stylesheet to use.\n\
Example: `-s https://cdnjs.cloudflare.com/ajax/libs/tufte-css/1.8.0/tufte.min.css`\n\n\
\
'--help` or '-h'\n\
This shows the help guide.\n\n\
\
`--lang` or `-l`\n\
Use this to specify the language of the HTML files.\n\
Example: `-l fr` for French"


function startHtml(title, css, lang) {
   var htmlStart = `<!doctype html>\n\
<html lang="${lang}">\n\
<head>\n\
  <meta charset="utf-8">\n\
  <title>${title}</title>\n\
  <meta name="viewport" content="width=device-width, initial-scale=1">\n\
${css}\
</head>\n\
<body>\n`;
   return htmlStart;
}

function interface(inStream) {
   return readline.createInterface({
      input: inStream,
      terminal: false,
   });
}

//main txt-to-html conversion function
function txtReader(source){
   const name=source.slice(source.lastIndexOf("/")+1,source.indexOf(".txt"));//for displaying message in the end
   const destination = outputPath+source.slice(source.lastIndexOf("/"),source.indexOf(".txt"))+".html";
   const inStream = fs.createReadStream(source);
   const outStream = fs.createWriteStream(destination, { encoding: "utf8" });
   const title=source.slice(source.lastIndexOf("/")+1,source.indexOf(".txt"));//set title
   
   //first half of html
   var htmlStart = startHtml(title, css, lang);

   //interface
   var reader = interface(inStream);

   //write the starting part
   outStream.write(htmlStart);

   var lineClosed=true;//whether line is clsoed with </p>
   //change to each line
   reader.on("line", function(line) {
      if(line.trim()==""){
         if (lineClosed==false){
            outStream.write("</p>\n\n");
            lineClosed=true;
         }else{
            outStream.write("\n");
         }
      }
      else{
         if (lineClosed==true){
            outStream.write("  <p>"+line);                    
            lineClosed=false;  
         }else{
            outStream.write(" "+line);
         }
      
      }
   });

   //write the ending part when there's no more
   reader.on("close", function() {
      outStream.write("</body>\n</html>\n");
   });

   console.log(`${name}.html`);//part of message for what's created
}

function mdReader(source){
   const name=source.slice(source.lastIndexOf("/")+1,source.indexOf(".md"));//for displaying message in the end
   const destination = outputPath+source.slice(source.lastIndexOf("/"),source.indexOf(".md"))+".html";
   const inStream = fs.createReadStream(source);
   const outStream = fs.createWriteStream(destination, { encoding: "utf8" });
   const title=source.slice(source.lastIndexOf("/")+1,source.indexOf(".md"));//set title
   
   //first half of html
   var htmlStart = startHtml(title, css, lang);

   //interface
   var reader = interface(inStream);

   //write the starting part
   outStream.write(htmlStart);

   var lineClosed=true;//whether line is clsoed with </p>
   var boldClosed= true;
   //change to each line
   reader.on("line", function(line) {

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
      

      if(line.trim()==""){
         if (lineClosed==false){
            outStream.write("</p>\n\n");
            lineClosed=true;
         }
         else{
            outStream.write("\n");
         }
      }
      else{
         if(line=="<hr>"){//if it's just a tag, write as it is; only has <hr> so far, but this can expand later
            outStream.write("  "+line+"\n");
         }
         else if (lineClosed == true) {
            outStream.write("  <p>" + line);
            lineClosed = false;
         }
         else {
            outStream.write(" " + line);
         }
      }
   });

   //write the ending part when there's no more
   reader.on("close", function() {
      outStream.write("</body>\n</html>\n");
   });

   console.log(`${name}.html`);//part of message for what's created
}



/**-------------------execute different things depending on args-------------------*/
//check for option validity
if(Object.keys(argv).length==0){
   console.log("No option used. Check README.md or use --help/-h option for details.");
   valid = false;
}
else{
   for(const [key, value] of Object.entries(argv)){
      if(!(key=="v" || key=="version" || key=="h" || key=="help" || key=="o" || key=="output" || key=="s" || key=="stylesheet" || key=="i" || key=="input" || key=="l" || key =="lang")){
         console.log("Invalid option used. Check README.md or use --help/-h option for details.");
         valid = false;
      }
   }
}


if(valid ==false){
   //nothing to do here, don't execute any option
}
//==ask for version==
else if(argv.version || argv.v){
   console.log(version);
}
//==help==
else if(argv.help || argv.h){
   console.log(help);
}
else{
   //==specify output==
   if(argv.output || argv.o){
      outputPath=(argv.output || argv.o)+"";
      fs.access(outputPath, function(err) {//check if the directory exist
         if (err && err.code === 'ENOENT') {
           console.log("Error! Specified output directory doesn't exist, so default back to ./dist folder.");
           outputPath="./dist";
         }else{
            if(outputPath.localeCompare("./dist")){//if outputing to an existing user-specified folder
               fs.promises.mkdir(outputPath, { recursive: true });
               console.log("Output file(s):");
            }
         }
      });  
   }

   //==specify stylesheet==
   if(argv.stylesheet || argv.s){
      css=`  <link rel="stylesheet" href="${(argv.stylesheet || argv.s)+""}">\n`;
   }

   //==specify language==
   if(argv.lang || argv.l){
         lang=argv.lang || argv.l;
   }

   //==when one or more file are provided, convert them to html==
   if(argv.input || argv.i){

      const source = (argv.input || argv.i)+""; 
      let outputed=false;//flag for whether any output is created
      
      fs.access("./dist", (err)=>{//check if dist folder exist; if so, delete before creating it
         if (!outputPath.localeCompare("./dist")){
            if (err){
               fs.promises.mkdir(outputPath, { recursive: true });
               console.log("New dis folder created. Output file(s):")
            }
            else{
               fs.rmSync(outputPath, {recursive: true}, (err => {}));
               console.log("Old dist folder deleted.");
               fs.promises.mkdir(outputPath, { recursive: true });
               console.log("New dis folder created. Output file(s):")
            }
         }       
      });

      var extension = path.extname(source);
      if( extension == ".txt" /* source.slice(-4)==".txt" */){//only 1 input file
         txtReader(source);
      }
      else if (extension == ".md"){
         mdReader(source);
      }
      else{//a directory as input
         fs.readdir(source, (err, files)=>{
            try{
               files.forEach(file=>{
                  var extension = path.extname(file);
                  if(extension ==".txt"){//only select txt files
                     txtReader(source+"/"+file);
                     outputed=true;
                  }
                  else if(extension == ".md"){
                     mdReader(source+"/"+file);
                     outputed=true;
                  }               
               });
               if(files.length==0){//for the case of source folder being empty
                  console.log("Invalid source. Source folder is empty!");
               }else if(outputed==false){
                  console.log("Invalid source. Please have txt/md file(s) in the folder.");//for the case of source folder being valid with no txt file inside
               }
            }catch(e){
               console.log("Invalid source. Please ensure source is valid and exists.");//if source doesn't exist or is invalid, will throw error and come here
            }      
         });
      }
   }
}






