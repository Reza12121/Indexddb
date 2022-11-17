const { MongoClient } = require('mongodb');
const uri = `mongodb://127.0.0.1:27017`;
const client = new MongoClient(uri, {});

const db_name = "tempdb";

async function main() {
    try {
        await client.connect();
        client.db(db_name).dropDatabase();
        console.log("deleted");
    } catch (err) {
        console.log(err);
    }
}

main();