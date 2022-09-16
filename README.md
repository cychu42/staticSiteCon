<h3 align="center">TXT-to-HTML Static Site Converter</h3>

## Goal
This is mainly a tool that converts txt files into static web pages.

## Requirment
Please first have Node.js installed on your machine. After downloading this tool, please run command "npm i" in command line(such as cmd or PowerShell) while inside the tool's directory to install required npm package(s).

## Usage
The user can provide one or more txt files to convert into html file(s) of the same names.<br />
Sample test files are in "test_files" folder.<br />
This tool is run by entering commands in command line.<br />
Use --input or -i to specify path to a txt file or a folder with txt files, and this tool will convert them into html files in 'dist' folder.<br />
If the dist folder doesn't exist at the current directory, one will be created. If it exist, it will be deleted first to clean old output before being recreated.<br />
Example: node SSC -i ./test_files

If you path has spaces for a file or folder, please use '' around the name(s).<br />
Example: node SSC -i ./'a folder with space in the name'

## Other options:
--version or -v<br />
This provides tool name and its version.

--output or -o<br />
Use this to specify an output directory instead of the dist folder. If the directory is invalid, output directory is set back to the default.<br />
For safety, the directory specified by this option is never deleted by the tool.<br />
Example: -o ./myFolder

--stylesheet or -s
Use this to specify url of the stylesheet to use.<br />
Example: -s https://cdnjs.cloudflare.com/ajax/libs/tufte-css/1.8.0/tufte.min.css

--help or -h
This shows the help guide.
