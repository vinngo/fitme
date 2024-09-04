import React from 'react';
import './dashboard.css'
import './HorizontalScrollContainer.jsx'
import Chatroom from './chatroom.jsx';


const Dashboard = () =>{
  return(
    <div className = "page">
      <Chatroom/>
    </div>
  )

}

export default Dashboard;