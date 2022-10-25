<h3 align="center">TXT-to-HTML Static Site Converter</h3>

## Goal

This is mainly a tool that converts TXT files into static web pages. Additionally, Markdown(MD) files will also get converted into HTML. Any **_bold_** text in the MD file will also appear **_bold_** in the HTML file. Also, any `---` or longer variations from Markdown files will become horizontal rule/line in the HTML files.
Any link syntax (such as `(text)[link]`) in Markdone files will be converted itno a HTML link.
If you have a static folder under your input folder directory, all fo its content will be copied to the static folder in the output directory.

## Requirment

Please first have Node.js installed on your machine. After downloading this tool, please run command `npm i` in command line(such as cmd or PowerShell) while inside the tool's directory to install required npm package(s).

## Usage

The user can provide one or more TXT/MD files to convert into HTML file(s) of the same names.<br />
Sample test files are in "test_files" folder.<br />
This tool is run by entering commands in command line.<br />

Use `--input` or `-i` to specify path to a TXT/MD file or a folder with TXT/MD files, and this tool will convert them into HTML files in 'dist' folder.<br />
If the dist folder doesn't exist at the current directory, one will be created. If it exist, it will be deleted first to clean old output before being recreated.<br />
Example: `node index -i ./test_files`

If you path has spaces for a file or folder, please use '' around the name(s).<br />
Example: `node index -i ./'a folder with space in the name'`

## Other options:

1. `--version` or `-v`<br />
   This provides tool name and its version.

2. `--output` or `-o`<br />
   Use this to specify an output directory instead of the dist folder. If the directory is invalid, output directory is set back to the default.<br />
   For safety, the directory specified by this option is never deleted by the tool.<br />
   Example: `-o ./myFolder`

3. `--stylesheet` or `-s`<br />
   Use this to specify url of the stylesheet to use.<br />
   Example: `-s https://cdnjs.cloudflare.com/ajax/libs/tufte-css/1.8.0/tufte.min.css`

4. `--help` or `-h`<br />
   This shows the help guide.

5. `--lang` or `-l`<br />
   Use this to specify the language of the HTML files.<br />
   Example: `-l fr` for French

6. `--config` or `-c`<br />
   Use this to specify JSON config file that has a list of options.<br />
   If the same option is provided in config file and command line argument, the command line argument will be overridden.<br />
   Example: `-c ./config_file/ssg-config.json` for below options to be added.<br />
   <span style="color:dimgray;;font-size:16px">config.json</span>

```json
{
  "input": "./test_files",
  "output": "./out",
  "stylesheet": "https://cdnjs.cloudflare.com/ajax/libs/tufte-css/1.8.0/tufte.min.css",
  "lang": "fr-CA",
  "future-feature": "invalid option will be ignored"
}
```
