const { MongoClient } = require('mongodb');
const uri = `mongodb://127.0.0.1:27017`;
const client = new MongoClient(uri, {});

async function main() {
    try {
        await client.connect();
        console.log(client);
    } catch (err) {
        console.log(err);
    }
}

main();