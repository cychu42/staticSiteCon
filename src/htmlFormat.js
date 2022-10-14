function startHtml(title, css, lang) {
    let htmlStart = `<!doctype html>\n\
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

 
//close html file writing proccess: write last part and output complete message
function closeHtml(reader,outStream, name){
   //write the ending part when there's no more
   reader.on("close", function() {
      outStream.write("</p>\n </body>\n</html>\n");
   });

   console.log(`${name}.html`);//part of message for what's created
};


module.exports={
    startHtml,
    closeHtml
};