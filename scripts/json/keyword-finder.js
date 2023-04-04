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
const JSON2Excel = require("./json-to-excel");

// @Variables
let density;
let data = [];

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

    if (matches) {
      density = (matches.length / fileContents.length) * 100;
      console.log(`Found ${matches.length} matches for ${keyword} in ${file}`);

      // Density
      console.log(`Density of ${keyword} in ${file} is ${density}%\n`);

      // @Push to keywordsInfo
      keywordsInfo.push({ file, keyword, matches: matches.length, density });
    } else {
      console.log(`No matches for ${keyword} in ${file}`);
    }
  }

  // TODO: Updating with mutliple value flag
  if (false) {
    // Rename to JSON
    const newFileName = file.replace(".html", ".json");

    // @Write to file
    fs.writeFileSync(
      `.cache/keyword-finder/${newFileName}`,
      JSON.stringify(keywordsInfo, null, 2),
      "utf8"
    );
  }

  let domain = file.replace(".html", "");

  // Save entire result to data
  data.push([
    ...keywordsInfo.map((keywordInfo) => {
      return {
        file: keywordInfo.file
          .replace(".html", "")
          // replaces everything before the domain variable
          .replace(new RegExp(`.*${domain}`), domain),

        keyword: keywordInfo.keyword,
        matches: keywordInfo.matches,
        density: keywordInfo.density,
      };
    }),
  ]);
}

// @Write to file
fs.writeFileSync(
  ".cache/keyword-finder/keyword-finder.json",
  JSON.stringify(data, null, 2),
  "utf8"
);

console.log(data[0][0].file);

JSON2Excel(data, data[0][0].file.replace("https://", "").replace(".html", ""));
