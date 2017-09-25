const fs = require("fs-extra");
const spawn = require("child_process").spawnSync;

// copy a source file into index.html
const copy = source => {
  try {
    fs.copySync("public/" + source + ".html", "public/index.html");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

switch (process.argv[2]) {
  case "inpage":
    copy("inpage");
    break;
  case "overlay":
    copy("overlay");
    break;
  case "input":
    copy("input");
    break;
  default:
    console.log(
      "Invalid command. Valid commands are 'inpage', 'overlay', or 'input'."
    );
    process.exit(1);
}

// run react-scripts as usual
spawn("react-scripts", ["start"], { stdio: "inherit" });
