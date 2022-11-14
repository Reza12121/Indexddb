const { MongoClient } = require('mongodb');
const uri = `mongodb://127.0.0.1:27017`;
const client = new MongoClient(uri, {});

function recordToString(record) {
    return `${record['start-time']},${record['end-time']},${record['window-height']},${record['window-width']},${record['QS-GTA-Car']},${record['QS-GTA-Notice-Quality']},${record['QS-GTA-QoE']},${record['QS-LoL-fights']},${record['QS-LoL-Notice-Quality']},${record['QS-LoL-QoE']},${record['QS-mturk-id']},${record['QS-Valorant-experience']},${record['QS-Valorant-Notice-Quality']},${record['QS-Valorant-shoot']}`;
}

(async function () {
    await client.connect();

    const collection = client
        .db('tempdb')
        .collection('submissions');

    const cursor = collection.find();
    const records = await cursor.toArray();

    const lines = [];
    lines.push("end-time,window-height,window-width,QS-GTA-Car,QS-GTA-Notice-Quality,QS-GTA-QoE,QS-LoL-fights,QS-LoL-Notice-Quality,QS-LoL-QoE,QS-mturk-id,QS-Valorant-experience,QS-Valorant-Notice-Quality,QS-Valorant-shoot");
    for (const record of records) {
        try {
            lines.push(recordToString(record));
        } catch (err) {
            console.log(err);
        }
    }
    console.log(lines.join('\n'));
}());