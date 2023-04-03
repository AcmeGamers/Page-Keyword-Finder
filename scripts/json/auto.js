const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const urls = require("../../data/json/auto.json");
let newURLs = [];

// directory maker
if (!fs.existsSync(".cache")) {
  fs.mkdirSync(".cache");
}
if (!fs.existsSync(".cache/auto")) {
  fs.mkdirSync(".cache/auto");
}

async function scrape(url) {
  // Fetch the page HTML
  const response = await axios.get(url);
  const html = response.data;

  // Load the HTML into Cheerio
  const $ = cheerio.load(html);

  // Get all urls of the same url and push them to an array
  $("a").each((i, el) => newURLs.push($(el).attr("href")));

  // Remove duplicates
  const uniqueUrls = [...new Set(newURLs)];

  // Remove undefined
  let filteredUrls = uniqueUrls.filter((url) => url !== undefined);

  // Remove null
  filteredUrls = uniqueUrls.filter((url) => url !== null);
}

scrape(baseUrl);
