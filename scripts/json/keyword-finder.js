// Author: Acme Gamers
// ----------------
// Table of Content
// ----------------
// @Imports
// @Variables
// @Directory Checker
// ----------------

// @Imports
const fs = require("fs");
const files = fs.readdirSync(".cache/url-scrapper");
const keywords = require("../../data/json/find-keywords.json");

// @Variables
const date = new Date();
const { month, day, year } = {
  month: date.getMonth() + 1,
  day: date.getDate(),
  year: date.getFullYear(),
};

// @Directory Checker
if (!fs.existsSync(".cache")) {
  fs.mkdirSync(".cache");
}
if (!fs.existsSync(".cache/keyword-finder")) {
  fs.mkdirSync(".cache/keyword-finder");
}

// @Loop through files
for (let i = 0; i < files.length; i++) {
  // @Read file
  const file = files[i];
  const keywordsInfo = [];

  // @Read file contents
  const fileContents = fs.readFileSync(`.cache/url-scrapper/${file}`, "utf8");

  // @Loop through keywords
  for (let j = 0; j < keywords.length; j++) {
    const keyword = keywords[j];
    const regex = new RegExp(keyword, "gi");
    const matches = fileContents.match(regex);
    const density = (matches.length / fileContents.length) * 100;

    if (matches) {
      console.log(`Found ${matches.length} matches for ${keyword} in ${file}`);

      // Density
      console.log(`Density of ${keyword} in ${file} is ${density}%\n`);

      // @Push to keywordsInfo
      keywordsInfo.push({ file, keyword, matches: matches.length, density });
    } else {
      console.log(`No matches for ${keyword} in ${file}`);
    }
  }

  // Rename to JSON
  const newFileName = file.replace(".html", ".json");

  // @Write to file
  fs.writeFileSync(
    `.cache/keyword-finder/${newFileName}`,
    JSON.stringify(keywordsInfo, null, 2),
    "utf8"
  );
}
