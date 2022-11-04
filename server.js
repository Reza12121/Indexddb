const express = require('express');
const fs = require('fs');
const url = require('url');
const path = require('path');

const app = express();

const MIME_TYPE = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.m4s': 'video/mp4',
    '.mp4': 'video/mp4',
    '.mpd': 'application/dash+xml',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
};

function getMimeType(filename) {
    const ext = path.extname(filename);
    let mimeType = MIME_TYPE[ext];
    console.log('Mime Type: ' + mimeType);
    if (mimeType === undefined) {
        mimeType = 'text/plain';
    }
    return mimeType;
}

//const DEFAULT_CONTENT_DIRECTORY = __dirname + '/content';
const DEFAULT_INDEX_HTML = __dirname + '/index.html';

app.get('/', (req, res) => {
    console.log('Requested URL: ' + req.url)
    const filename = DEFAULT_INDEX_HTML;
    fs.readFile(filename, 'binary', function (err, file) {
        if (err) {
            res.send('Could not find: index.html');
            res.end('Could not find: index.html');
            return;
        }
        res.set('Content-Type', 'text/html');
        res.end(Buffer.from(file, 'binary'));
    });
});

app.get('/*', (req, res) => {
    console.log('Requested URL: ' + req.url)
    const filename = __dirname + req.url;
    fs.readFile(filename, 'binary', function (err, file) {
        if (err) {
            console.log('Could not find resource: ' + filename);
            res.send('Could not find resource: ' + req.url);
            return;
        }
        res.set('Content-Type', getMimeType(filename));
        res.end(Buffer.from(file, 'binary'));
    });
});

app.listen(80);
console.log('running!');
//console.log('deafult dir' + DEFAULT_CONTENT_DIRECTORY)
