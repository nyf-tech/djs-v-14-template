const { MongoClient } = require('mongodb');
const url = "mongodb+srv://xarm:ZvgqTiusIuCKTrbl@cluster0.dzacc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


async function connectToDatabase() {
    const client = new MongoClient(url);
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db('mydb');
}

module.exports = connectToDatabase;