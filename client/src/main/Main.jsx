import './Main.css';
import { logo, planet1, planet2, planet3, planet4, planet5 } from '../assets/img-import.js';
import extractStatus from '../auth/Register';
import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Main() {
  const [errData, setErrData] = useState();

  const navigate = useNavigate();

  const onLogin = async () => {
    try {
      await axios.get('/routes/main');

    } catch (error) {
      console.log('/main error');
      navigate('../unauthorized');
    }
  }

  useEffect(() => {
    onLogin();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/routes/logout');
        console.log(res.data);
        
        navigate('../');
    } catch (err) {
        setErrData(`${extractStatus(err)}`);
    }
  }
  return (
    <>
      <div className='game-container'>

        <div className='navbar-container'>
          <div className='navbar-left'>
            <div><img src={logo} className='navbar-logo' alt='logo'></img></div>
          </div>
          <div className='navbar-right'>
            <div>User</div>
            <div>Settings</div>
            <form method='post' onSubmit={handleLogout}><button type='submit' name='submit'>Logout</button></form>
          </div>
        </div>
        
        <div className='main-container'>
          {/* <h1>Welcome to Main.jsx!</h1>
          <h2 className='error'>Error?:{errData}</h2> */}

          <div className='main-left'>
              <div className='drawer-container'>
                <div className='drawer-element'>A</div>
                <div className='drawer-element'>B</div>
                <div className='drawer-element'>C</div>
                <div className='drawer-element'>D</div>
                <div className='drawer-element'>E</div>
              </div>
          </div>
          
          <div className='main-right'>
            <div className='main-planet'>normal text test planet img<img src={planet1} className='planet-img' alt='planet'></img></div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Main;
