const fs = require('fs');
const path = require('path');

// function creates directoy if it doesn't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}

function saveToJson(filename, json) {
  ensureDir(path.dirname(filename));
  const data = JSON.stringify(json, null, 2);
  fs.writeFileSync(filename, data);
}

module.exports = saveToJson;
