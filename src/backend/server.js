const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5500;
require('dotenv').config()
const db = require('./dbconnection')
const openapi = require('./routes/openapiroute')
const workouts = require('./routes/workoutroute')

app.use(cors());
app.use(express.json());
app.use('/api', openapi)
app.use('/workouts', workouts)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
