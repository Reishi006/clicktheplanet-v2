import '../main/Main.css';
import { useState } from 'react';
import {
} from '../assets/img-import.js';

export default function Stats({ playerState, planetState }) {



    return (
        <>
            <div className='menu-container'>
                <div className='title'>Stats</div>
                <div className='stats-items-container'>
                    <div className='stats-item'>
                        <div>Current damage:</div>
                        <div>{playerState.currentDamage}</div>
                    </div>
                    <div className='stats-item'>
                        <div>Critical hit chance:</div>
                        <div>{`${playerState.critChance*10}%`}</div>
                    </div>
                    <div className='stats-item'>
                        <div>Total damage dealt:</div>
                        <div>{playerState.totalDamage}</div>
                    </div>
                    <div className='stats-item'>
                        <div>Highest level ever:</div>
                        <div>{planetState.maxLevel}</div>
                    </div>
                    <div className='stats-item'>
                        <div>Highest level stage:</div>
                        <div>{planetState.maxStage}</div>
                    </div>
                    <div className='stats-item'>
                        <div>Current gold:</div>
                        <div>{playerState.gold}</div>
                    </div>
                    <div className='stats-item'>
                        <div>Current diamonds:</div>
                        <div>{playerState.diamonds}</div>
                    </div>
                </div>
            </div>
        </>
    )
}