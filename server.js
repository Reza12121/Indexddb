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

const DEFAULT_INDEX_HTML = __dirname + "/public/index.html";

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
    return lines.join('\\n');
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

  const html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Survey Data</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    </style>
</head>

<body>
    <a id="a1" download="data1.csv">Download QS</a>
    <a id="a2" download="data2.csv">Download QvsS</a>
    <a id="a3" download="data3.csv">Download SSvsLS</a>
    <script>
        a1.href = window.URL.createObjectURL(new Blob(['${data_qs}'], { type: 'text/csv;charset=utf-8;' }));
        a2.href = window.URL.createObjectURL(new Blob(['${data_qvss}'], { type: 'text/csv;charset=utf-8;' }));
        a3.href = window.URL.createObjectURL(new Blob(['${data_ssvsls}'], { type: 'text/csv;charset=utf-8;' }));
    </script>
</body>

</html>
`;

  res.set("Content-Type", "text/html");
  res.end(html);
});

app.get("/", (req, res) => {
  console.log("Requested URL: " + req.url);
  const filename = DEFAULT_INDEX_HTML;
  console.log(filename);
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
  const filename = __dirname + '/public/' + req.url;
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