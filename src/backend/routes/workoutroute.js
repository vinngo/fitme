const express = require('express');
const db = require('../dbconnection');
const {ObjectId} = require('mongodb');
const router = express.Router();


//Create workout is handled by another apiroute. See openapiroute.js

router.delete("/:id", async(req, res) => {
  try{
    const query = {_id: new ObjectId(req.params.id)};

    const collection = await db.collection("workouts");
    let result = await collection.deleteOne(query);
    res.send(result).status(200);
  }catch(e){
    console.error(e);
    res.status(500).send("error deleting record");
  }
})


module.exports = router;


