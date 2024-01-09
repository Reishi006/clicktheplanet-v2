import './Main.css';
import {
  scaled_logo,
  gold,
  diamond,
  planet1, planet2, planet3, planet4, planet5,
  /* planetboss1, planetboss2, planetboss3, planetboss4, planetboss5, */
  /* laserGunBlue, laserGunGreen, laserGunRed, */
  store, ship, stats, guild, wheel,
  skipArrowLeft, skipArrowRight,
} from '../assets/img-import.js';
import Store from '../components/Store.jsx';
import Ship from '../components/Ship.jsx';
import Stats from '../components/Stats.jsx';
import Guild from '../components/Guild.jsx';
import Wheel from '../components/Wheel.jsx';
import Planet from '../components/Planet.jsx';
import Drawer from '../components/Drawer.jsx';
import extractStatus from '../auth/Register.jsx';
//import { getRandomColor, handlePlanet, handleArrowLeft, handleArrowRight } from '../functions/GameFunctions';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';


function Main() {
  const [errData, setErrData] = useState();
  const [socket, setSocket] = useState(null);
  const [userLogin, setUserLogin] = useState(null);
  const [show, setShow] = useState(0);
  const [randomPlanet, setPlanet] = useState();
  const [randColor, setRandColor] = useState({
    randPlanet: '',
    randHue: '',
  });
  const [planetState, setPlanetState] = useState({
    currentHp: 99,
    maxHp: 100,
    level: 8,
    stage: 0,
  });
  const [message, setMessage] = useState('mess');

  
  const options = [<Store/>, <Ship/>, <Stats/>, <Guild/>, <Wheel/>];

  const planets = [planet1, planet2, planet3, planet4, planet5];

  let planet = Math.floor(Math.random() * 5);
  let hueRotate = Math.floor(Math.random() * 359);

  const planetsColor = [
      {r: 84, g: 212, b: 216}, 
      {r: 102, g: 80, b: 41},
      {r: 35, g: 96, b: 44},
      {r: 75, g: 40, b: 111}, 
      {r: 90, g: 37, b: 37},
  ];

  function getRandomColor(planet) {
      /* const r = Math.floor(Math.random() * planetsColor[planet].r) + (planetsColor[planet].r - 20);
      const g = Math.floor(Math.random() * planetsColor[planet].g) + (planetsColor[planet].g - 20);
      const b = Math.floor(Math.random() * planetsColor[planet].b) + (planetsColor[planet].b - 20); */
      const r = planetsColor[planet].r;
      const g = planetsColor[planet].g;
      const b = planetsColor[planet].b;
      return `rgb(${r}, ${g}, ${b})`;
  }

  const initiatePlanet = () => {
    let checkRandom = planet;
    planet = Math.floor(Math.random() * 5);
    hueRotate = Math.floor(Math.random() * 359);
    if (planet === checkRandom) {planet = Math.abs(planet - 1);}
    setPlanet(planet);
    setRandColor({...randColor, randPlanet: getRandomColor(planet), randHue: hueRotate});
  }
  
  const handlePlanet = () => {
    let checkRandom = planet;
    planet = Math.floor(Math.random() * 5);
    hueRotate = Math.floor(Math.random() * 359);
    if (planet === checkRandom) {planet = Math.abs(planet - 1);}
    setPlanet(planet);
    setRandColor({...randColor, randPlanet: getRandomColor(planet), randHue: hueRotate});
    console.log(planetState.currentHp);
    if (planetState.currentHp > 0) {setPlanetState(planetState => ({...planetState, currentHp: planetState.currentHp - 10}))}
    if (planetState.currentHp <= 0) {setPlanetState(planetState => ({...planetState, currentHp: 0}))}

    socket.emit('sendclick', 'User clicked');

    socket.on('receiveclick', function(msg) {
      console.log('clicked');
      setMessage(msg);
    });
    
  }

  const handleArrowLeft = () => {
      console.log('Arrow Left');
  }

  const handleArrowRight = () => {
      console.log('Arrow Right');
  }

  const navigate = useNavigate();

  const onLogin = async () => {
    try {
      const res = await axios.get('/routes/mainadmin');

      setUserLogin(res.data.login);

      const newSocket = io(`http://localhost:8000`);
      setSocket(newSocket);
      return () => newSocket.close();

    } catch (error) {
      console.log('/main_admin error');
      navigate('../unauthorized');
    }
  }

  useEffect(() => {
    onLogin();
    initiatePlanet();
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
            <div><img src={scaled_logo} className='navbar-logo' alt='logo'></img></div>
          </div>
          <div className='navbar-right'>
            <div style={{fontSize: '12px'}}>Add gold, or whatever...</div>
            <div>{message}</div>
            <div>ADMIN:</div>
            <div>{userLogin}</div>
            <div>Settings</div>
            <form method='post' onSubmit={handleLogout}><button type='submit' name='submit'>Logout</button></form>
          </div>
          <div className='navbar-burger'>
            <div>Burgir</div>
          </div>
        </div>
        
        <div className='main-container'>
          {/* <h1>Welcome to Main.jsx!</h1>
          <h2 className='error'>Error?:{errData}</h2> */}

          <div className='main-left'>

              <Drawer setShow={setShow}></Drawer>

              <div className='main-content-container'>
                <div className='money-display'>
                  <div className='money-container'><img src={gold} className='money-logo' alt='gold'></img> 145</div>
                  <div className='money-container'><img src={diamond} className='money-logo' alt='diamond'></img> 100</div>
                </div>
                {options[show]}
              </div>

          </div>
          
          <div className='main-right'>
            <Planet
              randColor={randColor}
              planets={planets}
              randomPlanet={randomPlanet}
              handlePlanet={handlePlanet}
              handleArrowLeft={handleArrowLeft}
              skipArrowLeft={skipArrowLeft}
              handleArrowRight={handleArrowRight}
              skipArrowRight={skipArrowRight}
              planetState={planetState}
              setPlanetState={setPlanetState}
            ></Planet>
          </div>
        </div>

      </div>
    </>
  );
}

export default Main;
