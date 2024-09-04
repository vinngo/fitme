import NavBar  from './components/navbar/navbar.jsx';
import Dashboard from './components/dashboard/dashboard.jsx';
import LandingPage from './components/landing/landing.jsx';
import Workouts from './components/workouts/workouts.jsx';
import LoginPage from './components/login.jsx'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import PrivateRoute from './components/privateroute.jsx';


function App() {
  const isAuth = true;


  return (
    <div className = "App">
     <NavBar/>
     <div className = "Content">
      <Routes>
        <Route path = "/" element = {<LandingPage/>}/>
        <Route element = {<PrivateRoute isAuthenticated = {isAuth}/>}>
          <Route path = "/dashboard" element = {<Dashboard/>}/>
          <Route path = "/workouts" element = {<Workouts/>}/> 
        </Route>
        <Route path = "/login" element = {<LoginPage isAuthenticated = {isAuth}/>}/>
      </Routes>
     </div>
    </div>

  );
}

export default App;
