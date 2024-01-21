import x from '../assets/env/x.svg';

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {
    user_prof1, user_prof2, user_prof3, user_prof4, user_prof5,
} from '../assets/img-import.js';

export default function Profile({ 
    toggleProfile,
    setProf
}) {

    const [errData, setErrData] = useState();
    const [display, setDisplay] = useState(false);

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

    const navigate = useNavigate();

    const toggleDisplay = () => {
        if (display === true) {
          setDisplay(false);
        } else {
          setDisplay(true);
        }
      }

    const handleConfirm = () => {
        if (display === true) {
            setDisplay(false);
          } else {
            setDisplay(true);
          }
    }

    const handleRemove = async (e) => {
        e.preventDefault();
        try {
        const res = await axios.post('/routes/remove');
            console.log(res.data);
            
            navigate('../');
        } catch (err) {
            setErrData(`${extractStatus(err)}`);
        }
    }

    return (
        
        <>
            <div className='navbar-profile-toggle' onClick={toggleProfile}></div>
            <div className='navbar-profile'>
                <div className='navbar-profile-relative'>
                    <div className='navbar-profile-close-container'>
                        <img src={x} className='navbar-profile-close' onClick={toggleProfile} alt='close-profile'></img>
                    </div>
                    <div className='navbar-profile-title'>User Profile</div>
                    
                    <div>Choose your profile picture:</div>
                    <div className='navbar-profile-pictures'>
                        <img src={user_prof1} onClick={() => setProf(0)} alt='prof1'></img>
                        <img src={user_prof2} onClick={() => setProf(1)} alt='prof2'></img>
                        <img src={user_prof3} onClick={() => setProf(2)} alt='prof3'></img>
                        <img src={user_prof4} onClick={() => setProf(3)} alt='prof4'></img>
                        <img src={user_prof5} onClick={() => setProf(4)} alt='prof5'></img>
                    </div>
                    <div className='navbar-profile-remove'>
                        <button onClick={handleConfirm}>Remove account</button>
                    </div>
                </div>
            </div>
            {display && <div className='navbar-profile-remove-account'>
                <div>Do you really want to remove your account?</div>
                <form method='post' onSubmit={handleRemove}>
                    <button className='navbar-profile-remove-confirm' type='submit' name='submit'>Confirm removal</button>
                </form>
                <button className='navbar-profile-remove-cancel' onClick={handleConfirm}>Cancel</button>
            </div>}
        </>
    );
}