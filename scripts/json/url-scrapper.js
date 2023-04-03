const axios = require("axios");
const fs = require("fs");

const urls = ["https://itadon.com"];

async function scrape() {
  // Make the cache directory if it doesn't already exist
  if (!fs.existsSync(".cache")) {
    fs.mkdirSync(".cache");
  }
}

scrape();
