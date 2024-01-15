import '../App/App.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const extractStatus = (message) => {
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

function Register() {

  const [formValue, setFormValue] = useState({
    email: '', 
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
    console.log(formValue.email);
    console.log('Submit:'+ {formValue});
    try {
      const res = await axios.post('/routes/register', formValue);
        console.log(res.data)
        
        navigate('../login');
    } catch (err) {
      setErrData(`${extractStatus(err)}`);
    }
  }

  return (
    <>
      <div className='big-container'>
        <p className='auth-title'>Register</p>
        <h2 className='error'>{errData}</h2>
        <form method='post' onSubmit={handleSubmit}>
          <div className='input-container'>
            <div className="fas fa-envelope email"></div>
            <input type='email' name='email' placeholder='Enter your email' value={formValue.email} onChange={handleInput} required></input>
          </div>
          <div className='input-container'>
            <div className="fas fa-user user"></div>
            <input type='text' name='login' placeholder='Enter your login'  value={formValue.login} onChange={handleInput} required></input>
          </div>
          <div className='input-container'>
            <div className="fas fa-lock password"></div>
            <input type='password' name='password' placeholder='Enter your password' value={formValue.password} onChange={handleInput} required></input>
          </div>
          <button type='submit' className='submit-btn' name='submit'>Register</button>
        </form>
        <h6>Already have an account? <Link to='/login'>Login here</Link></h6>
      </div>
    </>
  );
}


export default Register;
