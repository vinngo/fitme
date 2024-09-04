import React from 'react';
import './landing.css';
import {useNavigate} from 'react-router-dom';


const LandingPage = () =>{
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return(
    <div className = "page">
      <header className = "header">
        <h1>Welcome to FitMe</h1>
        <p>Getting fit has never been this convenient before</p>
        <button onClick = {() => handleNavigate('/login')} className = "ctabutton">Get Started With FitMe</button>
      </header>
    </div>
  );

}

export default LandingPage;