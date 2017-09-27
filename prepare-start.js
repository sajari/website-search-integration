const fs = require("fs-extra");
const spawn = require("child_process").spawnSync;
const inquirer = require("inquirer");

// copy a source file into index.html
const copy = source => {
  try {
    fs.copySync("public/" + source + ".html", "public/index.html");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

const run = () => {
  spawn("react-scripts", ["start"], { stdio: "inherit" });
  process.exit(0);
};

// if the user has supplied an action run it without prompting
switch (process.argv[2]) {
  case "inline":
    copy("inline");
    run();
    break;
  case "overlay":
    copy("overlay");
    run();
    break;
  case "searchbox":
    copy("searchbox");
    run();
    break;
}

// prompt the user for which action to run
inquirer
  .prompt([
    {
      type: "list",
      name: "choice",
      message: "Which integration would you like to run?",
      choices: ["inline", "searchbox", "overlay"]
    }
  ])
  .then(answers => {
    copy(answers.choice);
    run();
  });
