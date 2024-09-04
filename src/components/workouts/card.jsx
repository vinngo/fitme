import {Grid, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Button, Typography, Stack, IconButton} from '@mui/material';
import React, {useEffect, useState} from 'react';
import ToolTip from './tooltip';


const Carde = ({workout_title, workout_obj, toolTip}) => {
  const [open, setOpen] = useState(false);

  if (workout_obj === undefined){
    return(
      <div>
      </div>
    )
  }
  const obj = JSON.parse(workout_obj);

  const handleOpen = () =>{
    setOpen(true);
  }

  const handleClose = () =>{
    setOpen(false);
  }
  

  return(
    
    <Grid>
    <Card sx = {{
          backgroundColor: '#242e47',
          color: 'white',
          margin: '0 15px',
          marginBottom: '15px',
          marginTop: '15px'
        }}>
      <CardActionArea onClick = {handleOpen}>
        <CardContent>
          <h3>
            {workout_title}
          </h3>
          <p>
            Click to expand
          </p>
        </CardContent>
      </CardActionArea>   
    </Card>
    {/*Dialog that opens when user clicks on the card */}
    <Dialog open = {open} onClose = {handleClose}>
      <DialogTitle>{workout_title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {obj.description} {/* Display the workout description */}
          </DialogContentText>
            {obj.exercises.map((exercise, index) => {
              return(
              <Stack direction = "row" sx = {{display: 'flex'}}>
                <Typography variant = "subtitle1" sx = {{justifyContent: 'flex-start'}}>{exercise.name + ": " + exercise.sets + " sets, " + (exercise.reps || exercise.duration) + (exercise.reps ? " reps" : "")}</Typography>
                <ToolTip toolT = {toolTip[index]}></ToolTip>
              </Stack>
              );
            })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
    </Dialog>
  </Grid>
  )
}

export default Carde;