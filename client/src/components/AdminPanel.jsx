import '../main/Main.css';
import { useState, useEffect } from 'react';
import {
} from '../assets/img-import.js';
import io from 'socket.io-client';

export default function AdminPanel({ playerState, setPlayerState, planetState, setPlanetState }) {
    const [socket, setSocket] = useState(null);

    const [gold, setGoldValue] = useState();
    const [diamonds, setDiamondsValue] = useState();
    const [level, setLevelValue] = useState();
    const [stage, setStageValue] = useState();
    const [crit, setCritValue] = useState();

    const handleGoldValue = (e) => {
        setGoldValue(e.target.value);
        console.log(gold);
    }
    const setGold = () => {
        socket.emit('setgold', gold);

        socket.once('receivesetgold', (data) => {
          console.log(data.gameState.player.gold);
          setPlayerState({...playerState, 
            gold: data.gameState.player.gold});
        });
    }


    const handleDiamondsValue = (e) => {
        setDiamondsValue(e.target.value);
        console.log(diamonds);
    }
    const setDiamonds = () => {
        socket.emit('setdiamonds', diamonds);

        socket.once('receivesetdiamonds', (data) => {
          console.log(data.gameState.player.diamonds);
          setPlayerState({...playerState, 
            diamonds: data.gameState.player.diamonds});
        });
    }


    const handleLevelValue = (e) => {
        setLevelValue(e.target.value);
        console.log(level);
    }
    const setLevel = () => {
        socket.emit('setlevel', level);

        socket.once('receivesetlevel', (data) => {
          console.log(data.gameState.planet.currentLevel);
          setPlayerState({...planetState, 
            currentLevel: data.gameState.planet.currentLevel});
        });
    }

    const handleStageValue = (e) => {
        setStageValue(e.target.value);
        console.log(stage);
    }
    const setStage = () => {
        socket.emit('setstage', stage);

        socket.once('receivesetstage', (data) => {
          console.log(data.gameState.planet.currentStage);
          setPlanetState({...planetState, 
            currentStage: data.gameState.planet.currentStage});
        });
    }

    const handleCritValue = (e) => {
        setCritValue(e.target.value);
        console.log(crit);
    }
    const setCrit = () => {
        socket.emit('setcrit', crit);

        socket.once('receivesetcrit', (data) => {
          console.log(data.gameState.player.critChance);
          setPlayerState({...playerState, 
            critChance: data.gameState.player.critChance});
        });
    }

    const onLoad = async () => {
        try {

            const newSocket = io(`http://localhost:8000`);
            setSocket(newSocket);

            return () => newSocket.close();


        } catch (error) {
            console.log('adminpanel error' + error);
        }
    }

    useEffect(() => {
        onLoad();
    }, []);

    return (
        <>
            <div className='menu-container'>
                <div className='title'>Admin Panel</div>
                <div className='adminpanel-container'>
                    <div className='adminpanel-input-container'>
                        <div className='adminpanel-input-title'>Gold: </div>
                        <div className='adminpanel-input'>
                            <input type='text' onChange={handleGoldValue} placeholder='Input something'></input>
                            <button onClick={setGold}>Set</button>
                        </div>
                    </div>
                    <div className='adminpanel-input-container'>
                        <div className='adminpanel-input-title'>Diamonds: </div>
                        <div className='adminpanel-input'>
                            <input type='text' onChange={handleDiamondsValue} placeholder='Input something'></input>
                            <button onClick={setDiamonds}>Set</button>
                        </div>
                    </div>
                    <div className='adminpanel-input-container'>
                        <div className='adminpanel-input-title'>Level: </div>
                        <div className='adminpanel-input'>
                            <input type='text' onChange={handleLevelValue} placeholder='Input something'></input>
                            <button onClick={setLevel}>Set</button>
                        </div>
                    </div>
                    <div className='adminpanel-input-container'>
                        <div className='adminpanel-input-title'>Stage: </div>
                        <div className='adminpanel-input'>
                            <input type='text' onChange={handleStageValue} placeholder='Input something'></input>
                            <button onClick={setStage}>Set</button>
                        </div>
                    </div>
                    <div className='adminpanel-input-container'>
                        <div className='adminpanel-input-title'>Critical hit chance: </div>
                        <div className='adminpanel-input'>
                            <input type='text' onChange={handleCritValue}placeholder='Input something'></input>
                            <button onClick={setCrit}>Set</button>
                        </div>
                    </div>
                    {/* <div className='adminpanel-input-container'>
                        <div className='adminpanel-input'>
                            <button className='adminpanel-setall'>Set all</button>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    )
}