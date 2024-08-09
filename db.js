const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/mydb";

async function connectToDatabase() {
    const client = new MongoClient(url);
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db('mydb');
}

module.exports = connectToDatabase;
