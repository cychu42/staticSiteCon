const { txtLineParser, mdLineParser } = require("../src/parser");

describe("txtParser tests", () => {
  const data = "something\nwhat\n\never";
  const expectedResult = "  <p>something what</p>\n\n  <p>ever";

  test("start a sentence with <p>", async () => {
    expect(txtLineParser("Hello", true).toWrite).toBe("  <p>Hello");
  });

  test("continue a sentence when line isn't closed", async () => {
    expect(txtLineParser("my name is John.", false).toWrite).toBe(
      " my name is John."
    );
  });

  test("close a sentence when empty space is encountered and line isn't closed", async () => {
    expect(txtLineParser("", false).toWrite).toBe("</p>\n\n");
  });

  test("write a \\n when empty space is encountered and line is closed", async () => {
    expect(txtLineParser("", true).toWrite).toBe("\n");
  });

  test("parse a simple text sample", async () => {
    const lines = data.split("\n");
    var result;
    var output = "";
    var lineClosed = true;

    lines.forEach((line) => {
      result = txtLineParser(line, lineClosed);
      output += result.toWrite;
      lineClosed = result.lineClosed;
    });
    expect(output).toBe(expectedResult);
  });
});

describe("mdLineParser tests", () => {
  const data = "**something,**\nwhat\n\never, and [text](link).----";
  const expectedResult =
    "  <p><b>something,</b> what</p>\n\n  <p>ever, and <a href=link>text</a>.<hr>";

  test("parse a simple text sample with horizontal line break, bold, and link syntax", async () => {
    const lines = data.split("\n");
    var result;
    var output = "";
    var lineClosed = true;
    var boldClosed = true;

    lines.forEach((line) => {
      result = mdLineParser(line, lineClosed, boldClosed);

      output += result.toWrite;
      lineClosed = result.lineClosed;
      boldClosed = result.boldClosed;
    });
    expect(output).toBe(expectedResult);
  });
});
