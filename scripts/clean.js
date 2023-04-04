const fs = require("fs");

const folders = {
  cache: ".cache",
  auto: ".cache/auto",
  keywordFinder: ".cache/keyword-finder",
  urlScrapper: ".cache/url-scrapper",
};

// Removes Cache folder
if (fs.existsSync(folders.cache)) {
  fs.rmdirSync(folders.cache, { recursive: true });
}

// Recreates all folders
for (const folder in folders) {
  if (!fs.existsSync(folders[folder])) {
    fs.mkdirSync(folders[folder], { recursive: true });
  }
}
