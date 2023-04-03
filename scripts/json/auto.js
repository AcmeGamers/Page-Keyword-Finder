const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const urls = require("../../data/json/auto.json");
let newURLs = [];

const baseUrl = "https://itadon.com";
const baseUrl2 = "itadon.com";
const urlQueue = [{ url: baseUrl, visited: false }];

// directory maker
if (!fs.existsSync(".cache")) {
  fs.mkdirSync(".cache");
}
if (!fs.existsSync(".cache/auto")) {
  fs.mkdirSync(".cache/auto");
}

async function scrape() {
  while (urlQueue.length > 0) {
    // Gets to the next URL from the queue
    const nextUrl = urlQueue.shift();

    // Skip the URLs that have already been visited
    if (nextUrl.visited) {
      continue;
    }

    // Fetches the page's HTML
    const response = await axios.get(nextUrl.url);
    const html = response.data;

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Scrapes the data
    // { Have to update }

    // Adds each link to the list of URLs to visit, if it's a relative link
    const links = $("a");
    links.each(function () {
      const link = $(this).attr("href");
      if (
        link &&
        link.startsWith("/") &&
        !urls.some((u) => u.url === baseUrl + link)
      ) {
        urlQueue.push({ url: baseUrl + link, visited: false });
      }
    });

    // Marks the URL as visited and adds it to the list of visited URLs
    nextUrl.visited = true;
    urls.push(nextUrl);

    // File name changer
    let fileName = nextUrl.url.replace("https://itadon.com/", "");
    fileName = fileName.replace("http://", "");
    fileName = fileName.replace("https://", "");
    fileName = fileName.replace("/", "-");

    // Checks file existence
    if (!fs.existsSync(`.cache/auto/${baseUrl2}.json`)) {
      // If the file does not exist, create it and write the initial JSON data
      fs.writeFileSync(`.cache/auto/${baseUrl2}.json`, JSON.stringify(urls));
    } else {
      // If the file already exists, write the updated JSON data only
      fs.writeFileSync(`.cache/auto/${baseUrl2}.json`, JSON.stringify(urls));
    }
  }
}

scrape();
