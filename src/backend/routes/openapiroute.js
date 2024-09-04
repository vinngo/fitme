const express = require('express');
const db = require("../dbconnection");
const OpenAI = require('openai');
const router = express.Router();
require('dotenv').config()
const gpt = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

const getGPTResponse = async (message, mode) => {
  const generationPrompt = `
    You are a fitness coach, with knowledge in all areas of fitness and nutrition. Create a 1 to 1 and a half hour workout based on the user given prompt.
    Follow the following format in JSON, with no other fields besides [title, description, and exercsies]. reps are to be stored as string variables. your response should only be in JSON format:

    {
      "title": "Upperbody and Core",
      "description": "A workout focusing on chest and arm muscles",
      "exercises": [
        {"name": "Push-ups", "sets": 3, "reps": 15},
        {"name": "Bench Press", "sets": 4, "reps": 10},
        {"name": "Bicep Curls", "sets": 3, "reps": 12},
        {"name": "Plank (for core stability)", "sets": 3, "duration": "30-60 seconds"}
      ]
    }
  `;

  if (mode === 'coach'){
    const completion = await gpt.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "You are a fitness coach, with knowledge in all areas of fitness and nutrition."}, 
      {role: "user", content: message}]
    });
    return completion.choices[0].message.content;
  } else {
    const completion = await gpt.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: generationPrompt}, 
      {role: "user", content: message}]
    });
    return completion.choices[0].message.content;
  }
}

const getToolTips = async (workouts) => {
  const systemMsg = `You are a fitness coach, with knowledge in all areas of fitness and nutrition. You are provided with a list of exercises and their volume and you are to
  briefly describe how to perform each exercise. Follow the following format in JSON, with no other fields besides tooltips. Each explanation is to be stored as a string variable. Your response
  should only be in JSON format.

  {
    "tooltips": [
      {title: "title1", description = "description1"},
      {title: "title2", description = "description2"},
      {title: "title3", description = "description3"},
    ]
  }
  `
  const completion = await gpt.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: systemMsg}, {role: "user", content: workouts}]
  });
  return completion.choices[0].message.content;
}

//get GPT response
router.post('/send-message', async (req,res) =>{
  const {message} = req.body;
  try {
    response = await getGPTResponse(message, "coach");
    res.json({reply:response});
  } catch(e){
    console.log('Error:', e);
    res.status(500).json({error: 'Could not get GPT response.'})
  }
})

router.post('/generate-workout', async (req, res) =>{
  const {message} = req.body;
  try {
    const response = await getGPTResponse(message, "workouts")
    //Create JSON document to insert into
    const newDocument = JSON.parse(response);
    const collection = await db.collection("workouts");
    
    const result = await collection.insertOne(newDocument);
    const insertedId = result.insertedId

    const query = {_id: insertedId};
    const insertedDoc = await collection.findOne(query);
    res.json({reply:JSON.stringify(insertedDoc)})
  } catch(e) {
    console.log('Error', e);
    res.status(500).json({error: 'Could not get GPT response.'})
  }
});

//create tooltips

router.post("/generateToolTips", async (req, res) => {
  try{
    const workouts = req.body;
    const stringify = JSON.stringify(workouts);
    const response = await getToolTips(stringify);

    const newDocument = JSON.parse(response);
    const collection = await db.collection("tooltips");

    const result = await collection.insertOne(newDocument);
    const insertedId = result.insertedId
    
    const query = {_id: insertedId};
    const insertedDoc = await collection.findOne(query);
    res.json({reply:JSON.stringify(insertedDoc)})
  } catch (e){
    console.log(e);
  }
})


module.exports = router;