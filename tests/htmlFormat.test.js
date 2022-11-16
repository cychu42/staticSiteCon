const { startHtml } = require("../src/htmlFormat");

describe("startHtml tests", () => {
  const startHtmlNoCss = `<!doctype html>\n\
 <html lang="ABC">\n\
 <head>\n\
   <meta charset="utf-8">\n\
   <title>ABC</title>\n\
   <meta name="viewport" content="width=device-width, initial-scale=1">\n\
 \
 </head>\n\
 <body>\n`;

  const startHtmlNormal = `<!doctype html>\n\
 <html lang="ABC">\n\
 <head>\n\
   <meta charset="utf-8">\n\
   <title>ABC</title>\n\
   <meta name="viewport" content="width=device-width, initial-scale=1">\n\
   <link rel="stylesheet" href="https://aLink.ca">\n\
 </head>\n\
 <body>\n`;

  test("no css should be present when it's not provided", async () => {
    expect(startHtml("ABC", "", "ABC")).toBe(startHtmlNoCss);
  });

  test("all arguments are provided", async () => {
    expect(
      startHtml(
        "ABC",
        '  <link rel="stylesheet" href="https://aLink.ca">\n',
        "ABC"
      )
    ).toBe(startHtmlNormal);
  });
});
