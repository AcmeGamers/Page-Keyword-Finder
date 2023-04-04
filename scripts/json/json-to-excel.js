const xlsx = require("xlsx");
const fs = require("fs");

function JSON2Excel(jsonData, fileName) {
  const rows = [];

  // Iterates over each array in jsonData
  for (let i = 0; i < jsonData.length; i++) {
    const arr = jsonData[i];

    // Adds the header row for each array
    if (i === 0) {
      rows.push(Object.keys(arr[0]));
    }

    // Adds the data rows for each array
    for (let j = 0; j < arr.length; j++) {
      rows.push(Object.values(arr[j]));
    }

    // Adds an empty row after each array, except for the last one
    if (i !== jsonData.length - 1) {
      rows.push([]);
    }
  }

  // Converts rows to XLSX format
  const worksheet = xlsx.utils.json_to_sheet(rows, { skipHeader: true });
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet);

  // checks if directory exists
  if (!fs.existsSync("./.output")) {
    fs.mkdirSync("./.output");
  }

  if (!fs.existsSync("./.output/excel")) {
    fs.mkdirSync("./.output/excel");
  }

  // Writes the file
  xlsx.writeFile(workbook, "./.output/excel/" + fileName + ".xlsx");
}

module.exports = JSON2Excel;
