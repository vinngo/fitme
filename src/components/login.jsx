import React from 'react'
import {Container, Button} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const LoginPage = ({isAuthenticated}) => {

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5500/auth/google';
  }

  return(
    <div class = "page">
      <Container sx = {{
        backgroundColor: '#121724',
        justifyContent: 'center',
        alignItems: 'center',
        height: "100vh",
        display: 'flex',
        
      }}>
        <Button variant = "contained" startIcon = {<GoogleIcon/>} sx = {{
          backgroundColor: '#53e06b',
          '&:hover': {
            backgroundColor: '#53e06b',
          },
          color: 'black',
          fontWeight: 'bold'
        }} onClick = {handleGoogleLogin}>
          Sign in with Google
        </Button>
      </Container>
    </div>
  )
}


export default LoginPage;