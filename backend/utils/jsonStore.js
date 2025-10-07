const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'backend', 'data');

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getFilePath(name) {
  ensureDirExists(dataDir);
  return path.join(dataDir, `${name}.json`);
}

function read(name, fallback = []) {
  try {
    const file = getFilePath(name);
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
      return fallback;
    }
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return fallback;
  }
}

function write(name, data) {
  const file = getFilePath(name);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return data;
}

module.exports = { read, write };


