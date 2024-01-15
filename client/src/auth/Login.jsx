import '../App/App.css';
//import extractStatus from './Register';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
//const axios = require('axios');

const extractStatus = (message) => {
  let status = String(message).match(/\b\d{3}\b/);
  if (String(status) === '404') {
    status = 'User not found (404)';
  } else if (String(status) === '409') {
    status = 'User already exists (409)';
  } else if (String(status) === '500') {
    status = 'Internal server error (500)';
  } else if (String(status) === '400') {
    status = 'Wrong username or password (400)';
  }
  return status;
}

function Login() {

  const [formValue, setFormValue] = useState({
    login: '', 
    password: ''
  });

  const [errData, setErrData] = useState();

  const navigate = useNavigate();

  const handleInput = (e) => {
    setFormValue({...formValue, [e.target.name]: e.target.value});
    console.log({...formValue, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit:'+ {formValue});
    try {
      const res = await axios.post('/routes/login', formValue);
        console.log(res.data);
        
        navigate('../main');
    } catch (err) {
        setErrData(extractStatus(err.message));
    }
  }

  return (
    <>
      <div className='big-container'>
        <p className='auth-title'>Login</p>
        <h2 className='error'>{errData}</h2>
        <form method='post' onSubmit={handleSubmit}>
          <div className='input-container'>
            <div className="fas fa-user user"></div>
            <input type='text' name='login' placeholder='Enter your login' value={formValue.login} onChange={handleInput} required></input>
          </div>
          <div className='input-container'>
            <div className="fas fa-lock password"></div>
            <input type='password' name='password' placeholder='Enter your password' value={formValue.password} onChange={handleInput} required></input>
          </div>
          <button type='submit' className='submit-btn' name='submit'>Login</button>
        </form>
        <h6>Don't have an account? <Link to='/register'>Register here</Link></h6>
      </div>
    </>
  );
}

export default Login;
