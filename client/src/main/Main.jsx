import './Main.css';
import {
  scaled_logo,
  gold,
  diamond,
  bell, settings,
  user_prof1, user_prof2, user_prof3, user_prof4, user_prof5,
  planet1, planet2, planet3, planet4, planet5,
  planetboss1, planetboss2, planetboss3, planetboss4, planetboss5,
  /* laserGunBlue, laserGunGreen, laserGunRed, */
  store, ship, stats, guild, wheel,
  hitGrad,
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
import Notifications from '../components/Notifications';
import extractStatus from '../auth/Register';
//import { getRandomColor, handlePlanet, handleArrowLeft, handleArrowRight } from '../functions/GameFunctions';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
//import gameState from '../../../server/game/gameState.js';




function Main() {
  const damageDisplayRef = useRef(null);

  const [errData, setErrData] = useState();
  const [socket, setSocket] = useState(null);
  const [userLogin, setUserLogin] = useState(null);
  const [show, setShow] = useState(0);
  const [display, setDisplay] = useState({
    settings: false,
    notifications: false,
  });
  const [coords, setCoords] = useState({x: 0, y: 0});
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

    crit: 0,
    isCritical: false,
  });
  const [planetState, setPlanetState] = useState({
    currentHp: 100,
    maxHp: 100,
    currentLevel: 1,
    maxLevel: 1,
    currentStage: 0,
    maxStage: 0,
    name: '',

    reset: false,
  });
  const [itemState, setItemsState] = useState({
    blueLaserGun: {
      level: 0,
      cost: 0,
      damage: 0,
      locked: false,
    },
    greenLaserGun: {
      level: 0,
      cost: 0,
      damage: 0,
      locked: true,
    },
    redLaserGun: {
      level: 0,
      cost: 0,
      damage: 0,
      locked: true,
    },
    purpleLaserGun: {
      level: 0,
      cost: 0,
      damage: 0,
      locked: true,
    },
  });

  const [allAnim, setAllAnim] = useState(true);
  const [hitAnim, setHitAnim] = useState(true);
  const [dmgAnim, setDmgAnim] = useState(true);
  const [planetAnim, setPlanetAnim] = useState(true);

  const [position, setPosition] = useState({ top: 0, left: 0 }); //diamond position;
  const [visible, setVisible] = useState(true);
  const timerRef = useRef();

  const [planetScale, setPlanetScale] = useState(0.5);

  const [spin, setSpin] = useState(0);

  /* const [isChecked, setIsChecked] = useState({
    option1: false,
    option2: false,
    option3: false,
  }); */

  const openChat = () => {
    socket.emit('openchat', 'i want chat opened');
    socket.once('receivechat', (data) => {
      console.log(data);
    });
  }

  const toggleAllAnim = () => {
    if (allAnim === false) {
      setAllAnim(true);
      setHitAnim(true);
      setDmgAnim(true);
      setPlanetAnim(true);
    }
    else {
      setAllAnim(false);
      setHitAnim(false);
      setDmgAnim(false);
      setPlanetAnim(false);
    }
    console.log(`toggleAllAnim`);
  }

  const toggleHitAnim = () => {
    if (hitAnim === false) setHitAnim(true);
    else setHitAnim(false);
    console.log(`toggleHitAnim`);
  }

  const toggleDmgAnim = () => {
    if (dmgAnim === false) setDmgAnim(true);
    else setDmgAnim(false);
    console.log(`toggleDmgAnim`);
  }

  const togglePlanetAnim = () => {
    if (planetAnim === false) setPlanetAnim(true);
    else setPlanetAnim(false);
    console.log(`togglePlanetAnim`);
  }

  useEffect(() => {
    console.log(`animations: ${allAnim}, ${hitAnim}, ${dmgAnim}, ${planetAnim}`);
  }, [allAnim, hitAnim, dmgAnim, planetAnim]);

  const planets = [planet1, planet2, planet3, planet4, planet5];
  const planetsBosses = [planetboss1, planetboss2, planetboss3, planetboss4, planetboss5];

  const namePlanet = [
  'A', 'B', 'C', 'D', 'E', 'F', 
  'G', 'H', 'I', 'J', 'K', 
  'L', 'M', 'N', 'O', 'P', 
  'Q', 'R', 'S', 'T', 'U', 
  'V', 'W', 'X', 'Y', 'Z'
  ];

  const namePlanetBosses = [
    'Inhabited planet', 'White dwarf', 'Red dwarf', 'Black Hole'
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


  const handleDiamond = () => {
    setVisible(false);

    socket.emit('diamonds', 'clicked');

    socket.on('receivediamonds', (data) => {
      setPlayerState({...playerState,
        diamonds: data.gameState.player.diamonds,
      });
    });
  
    // Generate random times
    const maxTime = 20000; // Maximum time in milliseconds
    const time = Math.floor(Math.random() * maxTime) + 10000;
  
    // Schedule the object to appear again
    timerRef.current = setTimeout(() => {
      setVisible(true);
      moveObject();
    }, time);

    console.log(`diamonds retrieved`);
   };

   const moveObject = () => {
    // Generate random positions
    const maxLeft = window.innerWidth - 100; // Assuming the object is 100px wide
    const maxTop = window.innerHeight - 100; // Assuming the object is 100px tall
    const leftPos = Math.floor(Math.random() * (maxLeft + 1));
    const topPos = Math.floor(Math.random() * (maxTop + 1));
   
    // Update the state with the new position
    setPosition({ top: topPos, left: leftPos });
    };
   
    useEffect(() => {
    setVisible(false);
    // Move the object immediately when the component mounts
    const maxTime = 10000;
    const time = Math.floor(Math.random() * maxTime) + 10000;
    setTimeout(() => {
      setVisible(true);
    }, time);
    moveObject();
   
    // Clean up on unmount
    return () => clearTimeout(timerRef.current);
    }, []);

    const handleResize = () => {
      // Generate random positions
      const maxLeft = window.innerWidth - 100; // Assuming the object is 100px wide
      const maxTop = window.innerHeight - 100; // Assuming the object is 100px tall
      const leftPos = Math.abs(position.left - maxLeft + 1);
      const topPos = Math.abs(position.top - maxTop + 1);
     
      // Update the state with the new position
      setPosition({ top: topPos, left: leftPos });
    }

    useEffect(() => {
      // Add the resize event listener
      window.addEventListener('resize', handleResize);
     
      // Clean up on unmount
      return () => window.removeEventListener('resize', handleResize);
     }, []);

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
    console.log(`planetName generated; genName: ${genName}`);
  }

  useEffect(() => {
    const handleWindowMouseMove = event => {
      setCoords({
        x: event.clientX,
        y: event.clientY,
      });
    };
    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      window.removeEventListener(
        'mousemove',
        handleWindowMouseMove,
      );
    };
  }, []);

  const displayDamageOverlay = () => {
    if (!damageDisplayRef.current) return;

    const newDamageDisplay = document.createElement('div');
    if (planetState.isCritical === false) {
      newDamageDisplay.textContent = `-${playerState.currentDamage}hp`;
      newDamageDisplay.className = 'planet-damage-display';
    } else if (planetState.isCritical === true) {
      newDamageDisplay.textContent = `-${planetState.crit}hp`;
      newDamageDisplay.className = 'planet-critdamage-display';
    }
    const planetPosition = damageDisplayRef.current.getBoundingClientRect();
    const randomX = Math.random() * planetPosition.width;
    const randomY = Math.random() * planetPosition.height;

    newDamageDisplay.style.left = `${planetPosition.left + randomX}px`;
    newDamageDisplay.style.top = `${planetPosition.top + randomY}px`;

    document.body.appendChild(newDamageDisplay);

    setTimeout(() => {
      document.body.removeChild(newDamageDisplay);
    }, 1500);
  }

  const displayHitSvg = () => {
    const hitSvg = document.createElement('div');

    hitSvg.className = 'planet-hit-svg';

    const x = coords.x;
    const y = coords.y;

    hitSvg.style.top = `calc(${y}px - 50px)`;/* `${y - hitSvg.height / 4}px`; */
    hitSvg.style.left = `calc(${x}px - 50px)`/* `${x - hitSvg.width / 4}px`; */

    document.body.appendChild(hitSvg);

    setTimeout(() => {
      document.body.removeChild(hitSvg);
    }, 700);
  }

 

  const resetPlanet = (s, bool) => {
      //NOT BOSS
      planetAnim && setPlanetScale(s);
      

      if (bool) {
        setTimeout(() => {
          let checkRandom = planet;
          planet = Math.floor(Math.random() * 5);
          hueRotate = Math.floor(Math.random() * 359);
          if (planet === checkRandom) {planet = Math.abs(planet - 1);}
          setPlanet(planet);
          setRandColor({...randColor, randPlanet: getRandomColor(planet), randHue: hueRotate});
          setPlanetScale(1);
        }, 300);
      } else if (!bool) {
        let checkRandom = planet;
        planet = Math.floor(Math.random() * 5);
        hueRotate = Math.floor(Math.random() * 359);
        if (planet === checkRandom) {planet = Math.abs(planet - 1);}
        setPlanet(planet);
        setRandColor({...randColor, randPlanet: getRandomColor(planet), randHue: hueRotate});
      }
  }

  useEffect(() => {
    generatePlanetName();
  }, [planetState.currentStage, planetState.currentLevel]);

  const handlePlanet = () => {
      socket.emit('sendclick', 'User clicked');

      socket.once('receiveclick', function(data) {

        setPlanetState({...planetState, 
          currentHp: data.gameState.planet.currentHp,
          maxHp: data.gameState.planet.maxHp,
          currentLevel: data.gameState.planet.currentLevel,
          maxLevel: data.gameState.planet.maxLevel,
          currentStage: data.gameState.planet.currentStage,
          maxStage: data.gameState.planet.maxStage,

          reset: data.reset,
          crit: data.crit,
          isCritical: data.isCritical,
        });


        setPlayerState(playerState => ({...playerState,
          gold: data.gameState.player.gold,
          currentDamage: data.gameState.player.currentDamage,
        }));
      });

      dmgAnim && displayDamageOverlay();
      hitAnim && displayHitSvg();

      //console.log('from react handlePlanet: '+planetState.currentLevel);
  }

  useEffect(() => {
    if (planetState.reset === true) {
      //console.log(planetState.reset);
      resetPlanet(0.01, true);
    }
  }, [planetState.reset]);

  useEffect(() => {
    resetPlanet(0.01, true);
  }, [planetState.maxStage]);


  const handleArrowLeft = () => {
      console.log('Arrow Left');

      socket.emit('arrowleft', 'clickedleftarrow');

      socket.once('receivearrowleft', function(data) {
        console.log(data.gameState.planet.maxHp);
        setPlanetState({...planetState, 
          currentHp: data.gameState.planet.currentHp,
          maxHp: data.gameState.planet.maxHp,
          currentLevel: data.gameState.planet.currentLevel,
          maxLevel: data.gameState.planet.maxLevel,
          currentStage: data.gameState.planet.currentStage,
          reset: data.reset,
        });
      });
      if (planetState.currentLevel > 1) resetPlanet(1, false);
      
  }

  const handleArrowRight = () => {
      console.log('Arrow Right');

      socket.emit('arrowright', 'clickedrightarrow');

      socket.once('receivearrowright', function(data) {
        
        setPlanetState({...planetState, 
          currentHp: data.gameState.planet.currentHp,
          maxHp: data.gameState.planet.maxHp,
          currentLevel: data.gameState.planet.currentLevel,
          maxLevel: data.gameState.planet.maxLevel,
          currentStage: data.gameState.planet.currentStage,
          reset: data.reset,
        });
        console.log(data.gameState.planet.currentLevel);
      });
      if (planetState.currentLevel !== planetState.maxLevel) resetPlanet(1, false);
  }

  const buyItem = (name, id) => {
    console.log(`buyitem ${name}`);
    socket.emit('buyitem', {name, id});

    socket.once('receivebuyitem', function(data) {
      setPlayerState({...playerState,
        gold: data.gameState.player.gold,
        currentDamage: data.gameState.player.currentDamage,
      });
      setItemsState({...itemState,
        [data.name]: {
          level: data['gameState']['items'][data.name]['level'],
          cost: data['gameState']['items'][data.name]['cost'],
          damage: data['gameState']['items'][data.name]['damage'],
        },
      })
    });
  }

  /* const handleSpin = (e) => {
  
  setIsClicked(true);
  setSpin(0);
    

    if (spin === 0) {
      setTimeout(() => {
        setIsClicked(false);
        console.log(spin);

        socket.emit('spin', 'spun');

        socket.once('receivespin', (data) => {
          console.log(data.spin);
          setSpin(data.spin);
        });
      }, 0)
    }
    setTimeout(() => {
      setSpin(0);
    }, 5000);
  }

  useEffect(() => {
  }, [spin]); */

  const getData = () => {

    socket.on('receiveload', (data) => {
      console.log(data);
    });
  }

  const navigate = useNavigate();

  const onLogin = async () => {
    try {
      const res = await axios.get('/routes/main');

      setUserLogin(res.data.login);
      setPlayerState(playerState => ({...playerState,
        gold: res.data.gold,
        diamonds: res.data.diamonds,

        currentDamage: res.data.currentdamage,
        totalDamage: res.data.totaldamage,
        critChance: res.data.critchance,
      }));
      setPlanetState(planetState => ({...planetState, 
        currentLevel: res.data.currentlevel, 
        maxLevel: res.data.maxlevel,
        currentStage: res.data.currentstage,
        maxStage: res.data.maxstage,

        currentHp: res.data.currenthp,
        maxHp: res.data.maxhp,
      }));
      setItemsState({...itemState,
        blueLaserGun: {
          level: res.data.bluelasergun.level,
          cost: res.data.bluelasergun.cost,
          damage: res.data.bluelasergun.damage,
          locked: res.data.bluelasergun.locked,
        },
        greenLaserGun: {
          level: res.data.greenlasergun.level,
          cost: res.data.greenlasergun.cost,
          damage: res.data.greenlasergun.damage,
          locked: res.data.greenlasergun.locked,
        },
        redLaserGun: {
          level: res.data.redlasergun.level,
          cost: res.data.redlasergun.cost,
          damage: res.data.redlasergun.damage,
          locked: res.data.redlasergun.locked,
        },
      });

      const newSocket = io(`http://localhost:8000`);
      setSocket(newSocket);
      

      if (res.data.admin === 1) {
        //newSocket.close();
        return navigate('../mainadmin');
      }
      
      return () => newSocket.close();


    } catch (error) {
      console.log('/main error ' + error);
      navigate('../unauthorized');
    }
  }

  useEffect(() => {
    onLogin();
    resetPlanet(0.01, true);

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

  const toggleNotifications = () => {
    if (display.notifications === true) {
      setDisplay(display => ({...display,
        notifications: false,
      }));
    } else {
      setDisplay(display => ({...display,
        notifications: true,
      }));
    }
  }
  const options = [<Store itemState={itemState} buyItem={buyItem}/>, 
  <Ship/>, 
  <Stats playerState={playerState} planetState={planetState}/>, 
  <Guild/>, 
  <Wheel /* handleSpin={handleSpin} */ spin={spin}/>];

  return (
    <>
      <div className='game-container'>

        {visible && <img onClick={handleDiamond} className='click-diamond' style={{ top: `${position.top}px`, left: `${position.left}px` }} src={diamond}></img>}

        <div className='navbar-container'>
          <div className='navbar-left'>
            <div><img src={scaled_logo} className='navbar-logo' alt='logo'></img></div>
          </div>
          <div className='navbar-right'>
            <div className='navbar-profile-container'>
              <div className='navbar-profile-nickname'>{userLogin}</div>
              <img className='navbar-profile-logo' src={user_prof1} alt='user-logo'></img>
            </div>
            {/* <div className='navbar-bell-container'>
              <img className='navbar-bell' onClick={toggleNotifications} src={bell} alt='notifications'></img>
              <div className='navbar-bell-notification'>1</div>
              {display.notifications && <Notifications toggleNotifications={toggleNotifications}></Notifications>}
            </div> */}
            <img src={settings} className='navbar-settings-icon' onClick={toggleSettings} alt='settings'></img>
            <form method='post' className='navbar-logout' onSubmit={handleLogout}><button type='submit' name='submit'>Logout</button></form>
          </div>
          {/* <div className='navbar-burger'>
            <div>One div</div>
            <div>Or another</div>
          </div> */}
        </div>

        {display.settings && <Settings 
        toggleSettings={toggleSettings}
        toggleAllAnim={toggleAllAnim}
        toggleHitAnim={toggleHitAnim}
        toggleDmgAnim={toggleDmgAnim}
        togglePlanetAnim={togglePlanetAnim}
        allAnim={allAnim}
        hitAnim={hitAnim}
        dmgAnim={dmgAnim}
        planetAnim={planetAnim}
        ></Settings>}
        
        <div className='main-container'>
          {/* <h1>Welcome to Main.jsx!</h1>
          <h2 className='error'>Error?:{errData}</h2> */}

          <div className='main-left'>

              <Drawer openChat={openChat} setShow={setShow}></Drawer>

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
              damageDisplayRef={damageDisplayRef}

              randColor={randColor}
              planets={planets}
              planetsBosses={planetsBosses}
              randomPlanet={randomPlanet}
              handlePlanet={handlePlanet}
              handleArrowLeft={handleArrowLeft}
              skipArrowLeft={skipArrowLeft}
              handleArrowRight={handleArrowRight}
              skipArrowRight={skipArrowRight}
              planetState={planetState}
              setPlanetState={setPlanetState}
              planetScale={planetScale}
            ></Planet>
          </div>
        </div>

      </div>
    </>
  );
}

export default Main;
