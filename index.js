const fs = require("fs");
var argv = require('minimist')(process.argv.slice(2));//args using minimist, but ignore first 2
delete argv['_'];//this tool does not use it

const { version } = require("./package.json");//version
const { writer, staticFileHandler } = require("./src/writer.js");
var { outputPath, css, lang, help } = require("./src/config.js");

var valid=true;//validity of options



//========================flag for option validity========================
if(Object.keys(argv).length==0){
   console.log("No option used. Check README.md or use --help/-h option for details.");
   valid = false;
}
else{
   for(const [key, value] of Object.entries(argv)){
      if(!(key=="v" || key=="version" || key=="h" || key=="help" || key=="o" || key=="output" || key=="s" || key=="stylesheet" || key=="i" || key=="input" || key=="l" || key =="lang" || key=="c" || key=="config")){
         console.log("Invalid option used. Check README.md or use --help/-h option for details.");
         valid = false;
      }
   }
}

//========================if config file is used instead========================
let optionConfig;
let configOptionValid = false;
if(argv.config || argv.c){
   try {
      const rawContent = fs.readFileSync(argv.c || argv.config).toString();
      optionConfig = JSON.parse(rawContent)
      configOptionValid = true;
   }catch(err){
      console.log("Could not find the config json file or could not be parsed.");
      valid = false;
   }
}


//the following code execute different things depending on args/options used
//========================vadlity flag checking========================
if(valid ==false){
   //nothing to do here, so don't execute any option
}
//========================ask for version========================
else if(argv.version || argv.v){
   console.log(version);
}
//========================help========================
else if(argv.help || argv.h){
   console.log(help);
}
//========================output and input with configuration========================
else{
   //-------------------specify output-------------------
   if(argv.output || argv.o || configOptionValid){
      if (configOptionValid && optionConfig['output']){
         outputPath=optionConfig.output;
      }else{
         outputPath=(argv.output || argv.o)+"";
      }
   }

   //-------------------specify stylesheet-------------------
   if(argv.stylesheet || argv.s || configOptionValid){
      if (configOptionValid){
         if(optionConfig['stylesheet']){
            css=`  <link rel="stylesheet" href="${(optionConfig.stylesheet)+""}">\n`;   
         }
      }else{
         css=`  <link rel="stylesheet" href="${(argv.stylesheet || argv.s)+""}">\n`;
      }
   }

   //-------------------specify language-------------------
   if(argv.lang || argv.l || configOptionValid){
         if (configOptionValid){
            if (optionConfig['lang']){
               lang=optionConfig.lang;
            }
         }else{
            lang=argv.lang || argv.l;
         }
   }

   //-------------------specify input start-------------------  
   if(argv.input || argv.i || configOptionValid){
      let source;
      if (configOptionValid){
         if (optionConfig['input']){
            source = optionConfig.input;
         }
      }else{
         source = (argv.input || argv.i)+""; 
      }
   
   //-------------------specify input end-------------------
      let staticPath = `${source}/static`;//to be removed if user is able to store specified static path in config.js to be used

      writer(outputPath, source, css, lang);//write the files
      staticFileHandler(staticPath, outputPath);//copy the static files

   }
}


