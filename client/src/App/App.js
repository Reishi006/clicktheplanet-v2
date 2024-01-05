import { logo } from '../assets/img-import.js';
import './App.css';
import { Link } from 'react-router-dom';
/* import { useState } from 'react';
import axios from 'axios'; */

function App() {

  return (
    <>
      <div className='big-container'>
        <img src={logo} className='game-logo' alt='logo'></img>
        <h1 className='welcome'>Welcome!</h1>
        <p>Want to play?</p>
        <div className='link-container'>
          <Link to='/register'><button>Play now!</button></Link>
        </div>
        <h5>Already have an account? <Link to='/login'>Login here</Link></h5>
      </div>
    </>
  );
}

export default App;
