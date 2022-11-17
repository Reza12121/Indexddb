const express = require("express");
const fs = require("fs");
const path = require("path");

const { MongoClient } = require('mongodb');
const uri = `mongodb://127.0.0.1:27017`;
const client = new MongoClient(uri, {});
client.connect();
const db_qs = client.db('tempdb').collection('survey-qs');
const db_qvss = client.db('tempdb').collection('survey-qvss');
const db_ssvsls = client.db('tempdb').collection('survey-ssvsls');

const app = express();
app.use(express.json());

const MIME_TYPE = {
  ".css": "text/css",
  ".html": "text/html",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript",
  ".json": "application/json",
  ".m4s": "video/mp4",
  ".mp4": "video/mp4",
  ".mpd": "application/dash+xml",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function getMimeType(filename) {
  const ext = path.extname(filename);
  let mimeType = MIME_TYPE[ext];
  console.log("Mime Type: " + mimeType);
  if (mimeType === undefined) {
    mimeType = "text/plain";
  }
  return mimeType;
}

const DEFAULT_INDEX_HTML = __dirname + "/index.html";

app.post("/submit-qs", (req, res) => {
  db_qs.insertOne(req.body);
  res.end();
});
app.post("/submit-qvss", (req, res) => {
  db_qvss.insertOne(req.body);
  res.end();
});
app.post("/submit-ssvsls", (req, res) => {
  db_ssvsls.insertOne(req.body);
  res.end();
});

// you can change the random number to anything you want
app.get("/F6QVYcAkE2X5rUtzdu65t681lZu3fy9V33RqEu1gfl4M9Hz2MUGgR7CXA1C0S4KA", async (req, res) => {
  async function getCollectionAsCSV(db, properties) {
    const cursor = db.find();
    const records = await cursor.toArray();
    const lines = [];
    lines.push(properties.join(","));
    for (const record of records) {
      try {
        lines.push(properties.map(p => record[p]).join(","));
      } catch (err) {
        console.log(err);
      }
    }
    return lines.join('\n');
  }

  const data_qs = await getCollectionAsCSV(
    db_qs,
    [
      'start-time',
      'end-time',
      'window-height',
      'window-width',
      'QS-GTA-Car',
      'QS-GTA-Notice-Quality',
      'QS-GTA-QoE',
      'QS-LoL-fights',
      'QS-LoL-Notice-Quality',
      'QS-LoL-QoE',
      'QS-mturk-id',
      'QS-Valorant-experience',
      'QS-Valorant-Notice-Quality',
      'QS-Valorant-shoot'
    ],
  );

  // TODO: replace properties with correct ones
  const data_qvss = await getCollectionAsCSV(
    db_qvss,
    [
      'start-time',
      'end-time',
      'window-height',
      'window-width',
      'QS-GTA-Car',
      'QS-GTA-Notice-Quality',
      'QS-GTA-QoE',
      'QS-LoL-fights',
      'QS-LoL-Notice-Quality',
      'QS-LoL-QoE',
      'QS-mturk-id',
      'QS-Valorant-experience',
      'QS-Valorant-Notice-Quality',
      'QS-Valorant-shoot'
    ],
  );

  // TODO: replace properties with correct ones
  const data_ssvsls = await getCollectionAsCSV(
    db_ssvsls,
    [
      'start-time',
      'end-time',
      'window-height',
      'window-width',
      'QS-GTA-Car',
      'QS-GTA-Notice-Quality',
      'QS-GTA-QoE',
      'QS-LoL-fights',
      'QS-LoL-Notice-Quality',
      'QS-LoL-QoE',
      'QS-mturk-id',
      'QS-Valorant-experience',
      'QS-Valorant-Notice-Quality',
      'QS-Valorant-shoot'
    ],
  );

  res.set("Content-Type", "application/json");
  res.end(JSON.stringify({
    "qs": data_qs,
    "qvss": data_qvss,
    "ssvsls": data_ssvsls
  }));
});

app.get("/", (req, res) => {
  console.log("Requested URL: " + req.url);
  const filename = DEFAULT_INDEX_HTML;
  fs.readFile(filename, "binary", function (err, file) {
    if (err) {
      res.send("Could not find: index.html");
      res.end("Could not find: index.html");
      return;
    }
    res.set("Content-Type", "text/html");
    res.end(Buffer.from(file, "binary"));
  });
});

app.get("/*", (req, res) => {
  console.log("Requested URL: " + req.url);
  const filename = __dirname + req.url;
  fs.readFile(filename, "binary", function (err, file) {
    if (err) {
      console.log("Could not find resource: " + filename);
      res.send("Could not find resource: " + req.url);
      return;
    }
    res.set("Content-Type", getMimeType(filename));
    res.end(Buffer.from(file, "binary"));
  });
});

app.listen(8080, "0.0.0.0");
console.log("Listening to http://localhost:8080/");