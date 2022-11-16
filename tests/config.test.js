const { outputPath, css, lang, help } = require("../src/config");

describe("config tests", () => {
  test("outputPath, css, lang, and help variables should all exist as string", async () => {
    expect(typeof outputPath).toBe("string");
    expect(typeof css).toBe("string");
    expect(typeof lang).toBe("string");
    expect(typeof help).toBe("string");
  });

  test("Output path should default to './dist'", async () => {
    expect(outputPath).toBe("./dist");
  });

  test("CSS link value should default to be empty", async () => {
    expect(css).toBe("");
  });

  test("Default language should be 'en-CA'", async () => {
    expect(lang).toBe("en-CA");
  });
});
