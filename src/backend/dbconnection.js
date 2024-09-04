const {MongoClient} = require('mongodb');

const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri);

const connectDB = async() =>{
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (e){
    console.log(e);
  }
}

connectDB();

const db = client.db("FitMe")

module.exports = db;
