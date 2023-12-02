const { readFileSync } = require("fs");
const { Numworks } = require("./src/numworks");
const calculator = new Numworks();
const name = process.argv[2]
  .split("\\")
  .slice(-1)[0]
  .split("/")
  .slice(-1)[0]
  .split(".py")[0];

const content = readFileSync(process.argv[2]).toString();

console.log("Waiting device...");
calculator.autoConnect(async function () {
  var storage = await calculator.backupStorage();
  storage.records.push({
    name: name,
    type: "py",
    autoImport: true,
    code: content,
  });
  await calculator.installStorage(storage, function (err) {
    process.exit();
  });
});
