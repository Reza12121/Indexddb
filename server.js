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

app.post("/submit-qs", async (req, res) => {
  try {
    const uuid = crypto.randomUUID();
    req.body.uuid = uuid; // add an uuid propertoy to req.body
    const response = await db_qs.insertOne(req.body);
    res.send(response);
    // or if you only want to send back the uuid
    // res.send({uuid});
  } catch (err) {
  res.status(500).send({message: "something went wrong"});
  }
});
app.post("/submit-qvss", (req, res) => {
  db_qvss.insertOne(req.body);
  res.end();
});
app.post("/submit-ssvsls", (req, res) => {
  db_ssvsls.insertOne(req.body);
  res.end();
});

// TODO: change the url to something random once everything is working perfectly
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
      'mturk-id',
      'start-time',
      'end-time',
      'window-height',
      'window-width',
      'QS-GTA-QoE',
      'QS-GTA-Notice-Quality',
      'QS-GTA-Car',
      'QS-LoL-QoE',
      'QS-LoL-Notice-Quality',
      'QS-LoL-Fights',
      'QS-Valorant-QoE',
      'QS-Valorant-Notice-Quality',
      'QS-Valorant-Shoot'
    ],
  );

  const data_qvss = await getCollectionAsCSV(
    db_qvss,
    [
      'mturk-id',
      'start-time',
      'end-time',
      'window-height',
      'window-width',
      "QvS-GTA-Normal-Quality-QoE",
      "QvS-GTA-Normal-Quality-Quality-Acceptable",
      "QvS-GTA-Normal-Quality-Yellow-Plane",
      "QvS-GTA-Normal-Stall-QoE",
      "QvS-GTA-Normal-Stall-Stall-Acceptable",
      "QvS-GTA-Normal-Stall-Yellow-Plane",
      "QvS-GTA-A-QoE",
      "QvS-GTA-A-Quality-acceptable",
      "QvS-GTA-A-Car",
      "QvS-GTA-Action-Stall-QoE",
      "QvS-GTA-Action-Stall-Stall-Acceptable",
      "QvS-GTA-Action-Stall-Car",
      "QvS-Valorant-Normal-Quality-QoE",
      "QvS-Valorant-Normal-Quality-Quality-Acceptable",
      "QvS-Valorant-Normal-Quality-Shoot",
      "QvS-Valorant-Normal-Stall-QoE",
      "QvS-Valorant-Normal-Stall-Stall-Acceptable",
      "QvS-Valorant-Normal-Stall-Shoot",
      "QvS-Valorant-Action-Quality-QoE",
      "QvS-Valorant-Action-Quality-Quality-Acceptable",
      "QvS-Valorant-Action-Quality-Shoot",
      "QvS-Valorant-Action-Stall-QoE",
      "QvS-Valorant-Action-Stall-Stall-Acceptable",
      "QvS-Valorant-Action-Stall-Shoot",
      "QvS-LOL-Normal-Quality-QoE",
      "QvS-LOL-Normal-Quality-Quality-Acceptable",
      "QvS-LOL-Normal-Quality-Shoot",
      "QvS-LoL-Normal-Stall-QoE",
      "QvS-LoL-Normal-Stall-Stall-Acceptable",
      "QvS-LoL-Normal-Stall-Shoot",
      "QvS-LOL-Action-Quality-QoE",
      "QvS-LOL-Action-Quality-Quality-Acceptable",
      "QvS-LOL-Action-Quality-Shoot",
      "QvS-LoL-Action-Stall-QoE",
      "QvS-LoL-Action-Stall-Stall-Acceptable",
      "QvS-LoL-Action-Stall-Shoot",
    ],
  );

  const data_ssvsls = await getCollectionAsCSV(
    db_ssvsls,
    [
      'mturk-id',
      'start-time',
      'end-time',
      'window-height',
      'window-width',
      "original-QoE",
      "original-Shoot",
      "1s-QoE",
      "1s-Stall-Acceptable",
      "1s-Shoot",
      "3s-QoE",
      "3s-Stall-Acceptable",
      "3s-Shoot",
      "6s-QoE",
      "6s-Stall-Acceptable",
      "6s-Shoot",
      "6-1s-QoE",
      "6-1s-Stall-Acceptable",
      "6-1s-Shoot",
      "12s-QoE",
      "12s-Stall-Acceptable",
      "12s-Shoot",
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
