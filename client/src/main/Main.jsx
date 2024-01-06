import './Main.css';
import { 
  logo,
  scaled_logo,
  gold,
  diamond,
  planet1, planet2, planet3, planet4, planet5,
  /* planetboss1, planetboss2, planetboss3, planetboss4, planetboss5, */
  store, ship, stats, guild, wheel,
  /* laserGunBlue, laserGunGreen, laserGunRed, */
} from '../assets/img-import.js';
import Store from '../components/Store';
import Ship from '../components/Ship';
import Stats from '../components/Stats';
import Guild from '../components/Guild';
import Wheel from '../components/Wheel';
import extractStatus from '../auth/Register';
import { useState, useEffect } from 'react';
import { keyframes, css } from "styled-components";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

let planet = Math.floor(Math.random() * 5);
let hueRotate = Math.floor(Math.random() * 359);

function Main() {
  const [errData, setErrData] = useState();
  const [show, setShow] = useState(0);
  const [randomPlanet, setPlanet] = useState();
  const [randColor, setRandColor] = useState({
    randPlanet: '',
    randHue: '',
  });

  const options = [<Store/>, <Ship/>, <Stats/>, <Guild/>, <Wheel/>];

  /* let planet = Math.floor(Math.random() * 5); */
  //console.log(planet);
  const planets = [planet1, planet2, planet3, planet4, planet5];

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
    console.log(`p index in getRandomColor: ${planet}`);
    return `rgb(${r}, ${g}, ${b})`;
  }

  const handlePlanet = () => {
    let checkRandom = planet;
    planet = Math.floor(Math.random() * 5);
    hueRotate = Math.floor(Math.random() * 359);
    console.log('huerotate'+hueRotate);
    if (planet === checkRandom) {planet = Math.abs(planet - 1);}
    setPlanet(planet);
    setRandColor({...randColor, randPlanet: getRandomColor(planet), randHue: hueRotate});
    console.log('randhhue' + randColor.randHue);
  }

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
    handlePlanet();
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
                <div className='drawer-element' onClick={() => setShow(0)}><img src={store} className='drawer-icon' alt='store'></img></div>
                <div className='drawer-element' onClick={() => setShow(1)}><img src={ship} className='drawer-icon' alt='ship'></img></div>
                <div className='drawer-element' onClick={() => setShow(2)}><img src={stats} className='drawer-icon' alt='stats'></img></div>
                <div className='drawer-element' onClick={() => setShow(3)}><img src={guild} className='drawer-icon' alt='guild'></img></div>
                <div className='drawer-element' onClick={() => setShow(4)}><img src={wheel} className='drawer-icon' alt='wheel'></img></div>
              </div>
              <div className='main-content-container'>
                <div className='money-display'>
                  <div className='money-container'><img src={gold} className='money-logo' alt='gold'></img> 145</div>
                  <div className='money-container'><img src={diamond} className='money-logo' alt='diamond'></img> 100</div>
                </div>
                {options[show]}
              </div>
          </div>
          
          <div className='main-right'>
            <div className='main-planet' 
              style={{ 
                '--breatheColor' : randColor.randPlanet,
                filter : `hue-rotate(${randColor.randHue}deg)`,
              }}
            >
              normal text test planet img
              <img 
                src={planets[randomPlanet]} 
                className='planet-img'
                onClick={handlePlanet} 
                alt='planet'
              ></img>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Main;
