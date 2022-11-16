let outputPath = "./dist"; //output path
let css = ""; //stylesheet url

//help description
const help =
  "## Goal\n\
This is mainly a tool that converts TXT files into static web pages. Additionally, Markdown(MD) files will also get converted into HTML.  Any bold text in the MD file will also appear bold in the HTML file. Also, any `---` or longer variations will become horizontal rule/line in the HTML files.\n\n\
\
## Requirement\n\
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
Example: -s https://cdnjs.cloudflare.com/ajax/libs/tufte-css/1.8.0/tufte.min.css\n\n\
\
'--help` or '-h'\n\
This shows the help guide.\n\n\
\
'--lang' or '-l'\n\
Use this to specify the language of the HTML files.\n\
Example: -l fr\n\n\
\
'--config' or '-c'\n\
Use this to specify JSON config file that has a list of options. If the same option is provided in config file and command line argument, the command line argument will be overridden.\n\
Example: -c ./config.json";

module.exports = {
  outputPath,
  css,
  lang,
  help,
};
