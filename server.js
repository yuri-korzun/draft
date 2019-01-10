const express = require('express');
const path = require('path');
/*const fs = require('fs-extra');*/
const fs = require('fs');
const util = require('util');
const IncomingForm = require('formidable').IncomingForm;
const storagePath = path.join(__dirname, 'storage');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const STORAGE_FILE = 'storage.json';

const server = express();

const HTTP_STATUSES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

let id = 0;
let lastData;

async function getStorageData () {
  return await readFile(path.join(storagePath, STORAGE_FILE));
}

getStorageData()
  .then(buffer => {
    lastData = JSON.parse(buffer.toString());
    console.log('ha', lastData);
    id = lastData.files.length;
    console.log('resp', lastData.files);
  })
  .catch(() => {
    console.log('fail');
    lastData = {'files': []};
    writeFile(path.join(storagePath, STORAGE_FILE), JSON.stringify(lastData));
  });

server.post('/upload', async (req, res) => {
  const form = new IncomingForm();

  form.on('file', (field, file) => {
    const newFileName = `${id}_${file.name}`;
    fs.createReadStream(file.path).pipe(fs.createWriteStream(path.join(storagePath, newFileName)));
    lastData.files.push(newFileName);
    writeFile(path.join(storagePath, STORAGE_FILE), JSON.stringify(lastData));
    id++;
    console.log('id', id);
  });

  form.on('end', () => {
    res.writeHead(HTTP_STATUSES.OK, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({status: 'ok'}));
  });

  form.parse(req);
});

server.get('/images', (req, res) => {
  getStorageData().then(buffer => {
    const lastData = JSON.parse(buffer.toString());
    const fileNames = lastData.files;

    res.json(fileNames);
  });
});

server.get('/last-image', (req, res) => {
  const fileName = lastData.files[lastData.files.length - 1];

  res.json(fileName);
});

server.get(/^((?!api\/).)*$/, (req, res) => {
  console.log('req url', decodeURI(req.url));
  res.sendFile(path.join(__dirname, decodeURI(req.url)));
});

server.listen(8000, () => {
  console.log('Server started!');
});
