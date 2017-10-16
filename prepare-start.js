const fs = require("fs-extra");
const spawn = require("child_process").spawnSync;
const inquirer = require("inquirer");

// copy a source file into index.html
const copyAndRun = source => {
  try {
    fs.copySync("public/" + source + ".html", "public/index.html");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  spawn("react-scripts", ["start"], { stdio: "inherit" });
  process.exit(0);
};

const choices = ["inline", "searchbox", "overlay", "content-block"];
const choice = process.argv[2];

// if the user has supplied an action run it without prompting
if (choices.indexOf(choice) !== -1) {
  copyAndRun(choice);
}

// prompt the user for which action to run
inquirer
  .prompt([
    {
      type: "list",
      name: "choice",
      message: "Which integration would you like to run?",
      choices
    }
  ])
  .then(answers => {
    copyAndRun(answers.choice);
  });
