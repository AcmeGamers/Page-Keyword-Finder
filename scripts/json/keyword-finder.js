// find all files in a directory
const fs = require("fs");
const files = fs.readdirSync(".cache/url-scrapper");

// @Loop through files
for (let i = 0; i < files.length; i++) {
  // @Read file
  const file = files[i];

  // Log file name
  console.log(file);
}
