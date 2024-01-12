import './Main.css';
import {
  scaled_logo,
  gold,
  diamond,
  settings,
  user_prof1, user_prof2, user_prof3, user_prof4, user_prof5,
  planet1, planet2, planet3, planet4, planet5,
  /* planetboss1, planetboss2, planetboss3, planetboss4, planetboss5, */
  /* laserGunBlue, laserGunGreen, laserGunRed, */
  store, ship, stats, guild, wheel,
  skipArrowLeft, skipArrowRight,
} from '../assets/img-import.js';
import Store from '../components/Store';
import Ship from '../components/Ship';
import Stats from '../components/Stats';
import Guild from '../components/Guild';
import Wheel from '../components/Wheel';
import Planet from '../components/Planet';
import Drawer from '../components/Drawer';
import Settings from '../components/Settings';
import extractStatus from '../auth/Register';
//import { getRandomColor, handlePlanet, handleArrowLeft, handleArrowRight } from '../functions/GameFunctions';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';


let count = 0;

function Main() {
  const [errData, setErrData] = useState();
  const [socket, setSocket] = useState(null);
  const [userLogin, setUserLogin] = useState(null);
  const [show, setShow] = useState(0);
  const [display, setDisplay] = useState({
    settings: false,
  });
  const [randomPlanet, setPlanet] = useState();
  const [randColor, setRandColor] = useState({
    randPlanet: '',
    randHue: '',
  });
  const [playerState, setPlayerState] = useState({
    gold: 100,
    diamonds: 100,
    currentDamage: 1,
    critChance: 0.1,
    totalDamage: 0,
  });
  const [planetState, setPlanetState] = useState({
    currentHp: 100,
    maxHp: 100,
    currentLevel: 1,
    maxLevel: 1,
    currentStage: 0,
    maxStage: 0,
    name: '',
  });
  const [message, setMessage] = useState('mess');

  
  const options = [<Store/>, <Ship/>, <Stats playerState={playerState} planetState={planetState}/>, <Guild/>, <Wheel/>];

  const planets = [planet1, planet2, planet3, planet4, planet5];

  const namePlanet = [
  'A', 'B', 'C', 'D', 'E', 'F', 
  'G', 'H', 'I', 'J', 'K', 
  'L', 'M', 'N', 'O', 'P', 
  'Q', 'R', 'S', 'T', 'U', 
  'V', 'W', 'X', 'Y', 'Z'
  ];

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

  const generatePlanetName = () => {
    let genName = `1${planetState.currentLevel}-${namePlanet[0]}${namePlanet[(planetState.currentLevel-1)%26]}${namePlanet[planetState.currentStage]}`;
    setPlanetState({...planetState, name: genName});
  }
  
  const resetPlanet = () => {
    let checkRandom = planet;
    planet = Math.floor(Math.random() * 5);
    hueRotate = Math.floor(Math.random() * 359);
    if (planet === checkRandom) {planet = Math.abs(planet - 1);}
    setPlanet(planet);
    setRandColor({...randColor, randPlanet: getRandomColor(planet), randHue: hueRotate});
    generatePlanetName();
  }

  const handlePlanet = () => {
    //console.log(`planetState.currentHp before: ${planetState.currentHp}`);
    
    //console.log(planetState.currentHp);
    socket.emit('sendclick', 'User clicked');

    socket.on('receiveclick', function(data) {
      setPlanetState(planetState => ({...planetState, 
        currentHp: data.gameState.planet.currentHp,
        maxHp: data.gameState.planet.maxHp,
        currentLevel: data.gameState.planet.currentLevel,
        currentStage: data.gameState.planet.currentStage,
        maxStage: data.gameState.planet.maxStage,
      }));
    });

    //console.log(`planetState.currentHp after: ${planetState.currentHp}`);
  }

  useEffect(() => {
    if (planetState.currentHp === planetState.maxHp) {
      resetPlanet();
    }
  }, [planetState.currentHp]);


  /* socket.on('receive_setall', (gameState) => {
    console.log(`setall`);
    setPlanetState(planetState => ({...planetState, currentHp: gameState.planet.currentHp}));
  }); */

  const handleArrowLeft = () => {
      console.log('Arrow Left');

      socket.emit('arrowleft', 'clickedleftarrow');

      socket.on('receivearrowleft', function(data) {
        setPlanetState(planetState => ({...planetState, 
          currentHp: data.gameState.planet.currentHp,
          maxHp: data.gameState.planet.maxHp,
          currentLevel: data.gameState.planet.currentLevel,
          currentStage: data.gameState.planet.currentStage,
        }));
      });
      
  }

  const handleArrowRight = () => {
      console.log('Arrow Right');

      socket.emit('arrowright', 'clickedrightarrow');

      socket.on('receivearrowright', function(data) {
        setPlanetState(planetState => ({...planetState, 
          currentHp: data.gameState.planet.currentHp,
          maxHp: data.gameState.planet.maxHp,
          currentLevel: data.gameState.planet.currentLevel,
          currentStage: data.gameState.planet.currentStage,
        }));
      });
  }

  useEffect(() => {
    resetPlanet();
  }, [planetState.currentLevel]);

  const navigate = useNavigate();

  const onLogin = async () => {
    try {
      const res = await axios.get('/routes/main');

      setUserLogin(res.data.login);
      setPlayerState(playerState => ({...playerState,
        gold: res.data.gold,
        diamonds: res.data.diamonds,

        totalDamage: res.data.totaldamage,
      }));
      setPlanetState(planetState => ({...planetState, 
        currentLevel: res.data.currentlevel, 
        maxLevel: res.data.maxlevel,
        currentStage: res.data.currentstage,
        maxStage: res.data.maxstage,

        currentHp: res.data.currenthp,
        maxHp: res.data.maxhp,
      }));


      const newSocket = io(`http://localhost:8000`);
      setSocket(newSocket);

      if (res.data.admin === 1) {
        //newSocket.close();
        return navigate('../mainadmin');
      }

      return () => newSocket.close();


    } catch (error) {
      console.log('/main error');
      navigate('../unauthorized');
    }
  }

  useEffect(() => {
    onLogin();
    resetPlanet();

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

  const toggleSettings = () => {
    if (display.settings === true) {
      setDisplay(display => ({...display,
        settings: false,
      }));
    } else {
      setDisplay(display => ({...display,
        settings: true,
      }));
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
            <div className='navbar-profile-container'>
            <div className='navbar-profile-nickname'>{userLogin}</div>
              <img className='navbar-profile-logo' src={user_prof1} alt='user-logo'></img>
            </div>
            <img src={settings} onClick={toggleSettings} alt='settings'></img>
            <form method='post' onSubmit={handleLogout}><button type='submit' name='submit'>Logout</button></form>
          </div>
          <div className='navbar-burger'>
            <div>Burgir</div>
          </div>
        </div>

        {display.settings && <Settings toggleSettings={toggleSettings}></Settings>}
        
        <div className='main-container'>
          {/* <h1>Welcome to Main.jsx!</h1>
          <h2 className='error'>Error?:{errData}</h2> */}

          <div className='main-left'>

              <Drawer setShow={setShow}></Drawer>

              <div className='main-content-container'>
                <div className='money-display'>
                  <div className='money-container'><img src={gold} className='money-logo' alt='gold'></img> {playerState.gold}</div>
                  <div className='money-container'><img src={diamond} className='money-logo' alt='diamond'></img> {playerState.diamonds}</div>
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
