import '../main/Main.css';
import { useState, useEffect } from 'react';
import {
} from '../assets/img-import.js';

export default function Wheel({ handleSpin, spin, isClicked }) {

    const [transition, setTransition] = useState('5s transform ease-in-out');
    const [transform, setTransform] = useState(`rotate(${spin}deg`);


    return (
        <>
            <div className='menu-container'>
                <div className='title'>Wheel</div>
                <div className='wheel-container'>
                    <div>Spin!</div>
                    <div className="wheel-small-container">
                        <div className="spinBtn" onClick={handleSpin}>Spin</div>
                        <div className="wheel" style={{ 
                            transition: isClicked ? '' : 'transform 5s ease-in-out', 
                            transform: isClicked ? 'none' : `rotate(${spin}deg)`,
                            }}>
                            <div className="number" style={{'--i': 1, '--clr': '#2134b0'}}><span>100</span></div>
                            <div className="number" style={{'--i': 2, '--clr': '#336663'}}><span>1</span></div>
                            <div className="number" style={{'--i': 3, '--clr': '#221f7a'}}><span>50</span></div>
                            <div className="number" style={{'--i': 4, '--clr': '#375166'}}><span>0</span></div>
                            <div className="number" style={{'--i': 5, '--clr': '#1cba4e'}}><span>1000</span></div>
                            <div className="number" style={{'--i': 6, '--clr': '#236499'}}><span>10</span></div>
                            <div className="number" style={{'--i': 7, '--clr': '#107d5c'}}><span>5</span></div>
                            <div className="number" style={{'--i': 8, '--clr': '#3a316e'}}><span>20</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}