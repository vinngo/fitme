import React from 'react';
import {Link} from 'react-router-dom';
import './navbar.css'

const NavBar = () =>{
  return(
    <nav>
      <ul>
        <li>
          <Link className = "link" to="/">Home</Link>
        </li>
        <li>
          <Link className = "link" to="/dashboard">Coach</Link>
        </li>
        <li>
          <Link className = "link" to="/workouts">Workouts</Link>
        </li>
        <li>
          <Link className = "link" to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  )

}

export default NavBar;