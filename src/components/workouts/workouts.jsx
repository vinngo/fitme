import React, {useState} from "react";
import {Grid, Stack, Button, FormGroup, FormLabel, Checkbox, FormControl, FormControlLabel, Alert, AlertTitle} from "@mui/material";
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import DeleteIcon from '@mui/icons-material/Delete';
import './workouts.css';
import Dialog from '@mui/material/Dialog';
import TextField from "@mui/material/TextField";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Carde from './card.jsx';



const Workouts = () =>{
  
  //state variables
  const [workouts, setWorkouts] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [openGeneration, setOpen] = useState(false);
  const [openDelete, setOpend] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [checkedList, setCheckedList] = useState([])
  const [toolTips, setToolTips] = useState([]); //[[tooltips1], [tooltips2]]

  //event handlers

  const createToolTips = async (workoutData) =>{
    //create tool tip for newly created workout.
    try {
      const exercises = workoutData.exercises;
      const response = await fetch('http://localhost:5500/api/generateToolTips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(exercises)
      });
      const data = await response.json();
      const toolTip = JSON.parse(data.reply)
      return toolTip;
    } catch (e){
      console.log(e)
    }
  }

  const throwAlert = () =>{
    setAlertVisible(true);

    setTimeout(() =>{
      setAlertVisible(false);
    }, 5000)
  }

  const handlePressDelete = () => {
    setOpend(true);
  }

  const handleCloseDelete = () => {
    setOpend(false);
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }
  
  const handleSubmit = async () => {
    handleClose();
    try { 
      console.log("sending prompt", prompt)
      const response = await fetch('http://localhost:5500/api/generate-workout',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({message: prompt}), 
      });

      if (!response.ok){
        throw new Error('response not ok')
      }

      const data = await response.json();
      console.log(data.reply);
      const obj = JSON.parse(data.reply);
      //TODO: save obj to db....
      const toolTip = await createToolTips(obj);
      
      setToolTips(prevToolTips => [...prevToolTips, toolTip]);
      setWorkoutData(prevWorkoutData => [...prevWorkoutData, data.reply]);
      setWorkouts(prevWorkouts => [...prevWorkouts, obj.title]);
      setCheckedList([workouts.length].fill(false));

    } catch (e){
      console.log('Error:', e)
      throwAlert();
    }
    setPrompt('');

  }

  const handleCheck = (index) => {
    const newCheckedList = [...checkedList];
    newCheckedList[index] = !newCheckedList[index];
    setCheckedList(newCheckedList);
  } 

  const handleDelete = async() =>{
    for (let i = 0; i < checkedList.length; i++){
      if (checkedList[i] === true){
        try{
          const workoutToBeRemoved = workoutData[i];
          const objToBeRemoved = JSON.parse(workoutToBeRemoved)
          const workoutId = objToBeRemoved._id;

          const response = await fetch(`http://localhost:5500/workouts/${workoutId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          console.log(response.status)

          //updating state
          const newWorkoutData = [...workoutData];
          const newWorkoutTitle = [...workouts];

          newWorkoutData.pop(i);
          newWorkoutTitle.pop(i);

          setWorkoutData(newWorkoutData);
          setWorkouts(newWorkoutTitle);
          setCheckedList([workouts.length].fill(false));
          setOpend(false);
        } catch(e) {
          console.log(e);
        }
      }
    }
    setOpend(false);
  }

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  }

  return(
    <div className = "Page">
      {alertVisible && (<Alert severity = "error" variant = "filled" sx = {{marginBottom: '30px'}} onClose = {() => setAlertVisible(false)}>
        <AlertTitle>Error</AlertTitle>
        Request Failed
      </Alert>)}
      <h1>
        Workouts
      </h1>
      <h4>
        Generate with AI to get started!
      </h4>
      <Stack direction = "column" spacing = {2}>
        <Stack direction = "row" spacing = {2}>
          <Button variant = "contained" startIcon = {<AutoFixNormalIcon/>} sx = {{
            backgroundColor: '#53e06b',
            '&:hover': {
              backgroundColor: '#53e06b',
            },
            width: '25%',
            color: 'black',
          }} onClick = {handleOpen}>Generate With AI</Button>

          <Button variant = "contained" startIcon = {<DeleteIcon/>} sx = {{
            backgroundColor: '#fc033d',
            '&:hover': {
              backgroundColor: '#fc033d',
            },
            width: '25%',
            color: 'black',
          }} onClick = {handlePressDelete}>Delete</Button>
          {/*Debugging Button*/}

        </Stack>
      <Grid container spacing = {2} item = {true} sx = {{
        border: '2px solid',
        borderRadius: '15px',
        borderColor: '#242e47'
      }}>
        {workouts.map((wrk, index) => (
          <Carde workout_title = {wrk} workout_obj = {workoutData[index]} toolTip = {toolTips[index].tooltips} />
        ))}
      </Grid>

      </Stack>


      {/*Dialog for generation button*/}
      <Dialog
        open = {openGeneration}
        onClose = {handleClose}>
        <DialogTitle>
          Enter a prompt
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            List your specific goals and needs for the workout. FitMe will try to create a workout best suited for you. Try to be as descriptive as possible.
          </DialogContentText>
          <TextField
          fullWidth
          margin = "dense"
          type = "text"
          value = {prompt}
          onChange = {handlePromptChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick = {handleClose}>Cancel</Button>
          <Button onClick = {handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/*Dialog for pressing delete button*/}
      <Dialog open = {openDelete} onClose = {handleCloseDelete}>
        <DialogTitle>
          Delete a workout
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx = {{marginBottom: '15px'}}>
            Select a workout card(s) to delete.
          </DialogContentText>
          <FormControl>
            <FormGroup>
              <FormLabel>
                Workouts
              </FormLabel>
              {workouts.map((wrk, index) => (
                <FormControlLabel
                control = {<Checkbox index = {index} checked = {checkedList[index] || false} onChange = {() => handleCheck(index)}/>} label = {wrk}>
                </FormControlLabel>
              ))}
            </FormGroup>
          </FormControl>
          <DialogActions>
            <Button onClick = {handleCloseDelete}>Cancel</Button>
            <Button onClick = {handleDelete}>Delete</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default Workouts;