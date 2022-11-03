const express = require('express')
const app = express ()
const fs = require('fs');
const url = require("url");
const path = require("path");

const MIME_TYPE = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "svg": "image/svg+xml",
    "json": "application/json",
    "js": "application/javascript",
    "css": "text/css",    
    "mpd":"application/dash+xml",
    "mp4": "video/mp4",    
    "m4s": "video/mp4"
  };

function getMimeType(filename)
{
    var mimeType = MIME_TYPE[filename.split('.').pop()];
    console.log("Mime Type = " + mimeType);
    if (!mimeType) {
        mimeType = 'text/plain';
    }
    return mimeType;
}

//const DEFAULT_CONTENT_DIRECTORY = __dirname + '/content';
const DEFAULT_INDEX_HTML = __dirname + '/index.html';


app.get('/', (req, res) => {
       
    var filename = DEFAULT_INDEX_HTML;
    console.log("Req url = " + req.url);
    fs.readFile(filename, "binary", function(err, file) {
        if(err) {        
            res.send('Could not find default index.html');
            res.end();
            return;
        }
        
        res.set('Content-Type', 'text/html');
        //res.send(file);
        //res.end();
        res.end(Buffer.from(file, 'binary'));
    });    
})

app.get('/content*', (req, res) => {
    //console.log('Requested URL = ' + req.url)
    //res.send('Get the article');
    var filename = __dirname + req.url;
    console.log("Filename = " + filename);
    fs.readFile(filename, "binary", function(err, file) {
        if(err) {  
            console.log('Could not find resource = ' + filename);      
            res.send('could not fint item = ' + req.url);
            return;
        }        
        res.set('Content-Type', getMimeType(filename));
        //res.send(file);
        //res.end();
        res.end(Buffer.from(file, 'binary'));
    });    

})


app.listen(3000)
console.log('running!')
//console.log('deafult dir' + DEFAULT_CONTENT_DIRECTORY)
