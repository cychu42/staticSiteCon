## Requirement

1. Please first have Node.js installed on your machine.
2. Install recommended extensions, which should prompt when you open the this project in an IDE.
   Note: `.vscode/settings.json`'s setting will override your IDE setting for this tool.
3. After downloading this tool, please run command `npm i` in command line(such as cmd or PowerShell) while inside the tool's directory to install required npm package(s).

## Before Submitting A Pull Request

1. Run Prettier via command `npx prettier --write .` to format your code while at the root folder.
2. Run ESlint via command `npx eslint .` to check for errors in your code while at the root folder, and then fix them, if any.
   It's fine to fix codes introduced by Prettier if needed.
3. Run `npm test` to make sure all tests pass. If not, please fix your code to do so.

## Running Tests

All tests are in `tests` folder.
To run all tests, use `npm test` command.
To run individual tests, use `npm test [test-path]`. For example, `npm test ./tests/parser`. The `.test.js` extension is not required for the command.

## Writing Tests

All tests are in `tests` folder.
To write tests, please make sure your test is needed and not covered by existing tests. Try to follow the syntax and format of existing test and/or look up [Jest](https://jestjs.io/docs/using-matchers) documentations for how to do it.
Please keep test file scope to their respective file and name them accordingly. For example, if you want to make a test file for `writer.js`, create a `writer.test.js` file in the `tests` folder, and make sure all tests within `writer.test.js` are about code inside `writer.js`.
