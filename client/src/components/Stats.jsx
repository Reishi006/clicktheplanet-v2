import '../main/Main.css';
import { useState } from 'react';
import {
} from '../assets/img-import.js';

export default function Stats() {



    return (
        <>
            <div className='menu-container'>
                <div className='title'>Stats</div>
                <div className='stats-items-container'>
                    <div className='stats-item'>
                        <div>Current damage:</div>
                        <div>1</div>
                    </div>
                    <div className='stats-item'>
                        <div>Critical hit chance:</div>
                        <div>2</div>
                    </div>
                    <div className='stats-item'>
                        <div>Total damage dealt:</div>
                        <div>321312980</div>
                    </div>
                    <div className='stats-item'>
                        <div>Highest level ever:</div>
                        <div>475</div>
                    </div>
                    <div className='stats-item'>
                        <div>Highest level stage:</div>
                        <div>9</div>
                    </div>
                    <div className='stats-item'>
                        <div>Current gold:</div>
                        <div>145</div>
                    </div>
                    <div className='stats-item'>
                        <div>Current diamonds:</div>
                        <div>100</div>
                    </div>
                </div>
            </div>
        </>
    )
}