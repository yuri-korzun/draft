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

async function checkStorage() {
  return await readFile(path.join(storagePath, STORAGE_FILE));
}

checkStorage().then(buffer => {
  lastData = JSON.parse(buffer.toString());
  id = last.files.length;
  console.log('resp', last.files);
}).catch(() => {
  lastData = {"files": []};
  writeFile(path.join(storagePath, STORAGE_FILE), JSON.stringify(lastData));
});

server.post('/upload', async (req, res) => {
  console.log('2');

  /*res.writeHead(HTTP_STATUSES.OK, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({status: 'ok'}));*/


  const form = new IncomingForm();

  form.on('file', (field, file) => {
    const newFileName = `${id}_${file.name}`;
    fs.createReadStream(file.path).pipe(fs.createWriteStream(path.join(storagePath, newFileName)));
    lastData.files.push(newFileName);
    writeFile(path.join(storagePath, STORAGE_FILE), JSON.stringify(lastData));
    id ++;
    console.log('id', id);
  });
  form.on('end', () => {
    res.writeHead(HTTP_STATUSES.OK, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({status: 'ok'}));
  });
  form.parse(req);
});

server.listen(8000, () => {
  console.log('Server started!');
});
