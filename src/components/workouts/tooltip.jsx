import React, {useState} from 'react';
import {Button, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText, IconButton} from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

const ToolTip = (toolT) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () =>{
    setOpen(true);
  }

  const handleClose = (event) => {
    event.stopPropagation();
    setOpen(false);
  }
  
  
  return(
    <>
      <IconButton onClick = {handleOpen}>
        <QuestionMarkIcon/>
          <Dialog 
          open = {open}
          onClose = {handleClose}>
            <DialogTitle>
              {toolT.toolT.title}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {toolT.toolT.description}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick = {handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
      </IconButton>
    </>
    
  );

}

export default ToolTip;