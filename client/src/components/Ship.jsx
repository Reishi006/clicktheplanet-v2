import '../main/Main.css';
import { useState } from 'react';
import {
    radiation,
    bullets,
    critHitGrad,
    coin,
    lock,
    plus,
    gold, diamonds
} from '../assets/img-import.js';

export default function Ship({ shipState, buyShip }) {



    return (
        <>
            <div className='menu-container'>
                <div className='title'>Ship</div>
                <div className='ship-items-container'>
                    <div className='ship-item'>
                        <div className='ship-item-container-left'>
                            <img src={radiation} className='ship-item-img' alt='radiation'></img>
                            <div className='ship-item-lv'>Lv.{shipState.dps.level}</div> 
                            <div>Boost damage per second (DPS)</div>
                            <div className='money-container'><img src={gold} className='money-logo' alt='gold'></img> {shipState.dps.cost}</div>
                            <div>x{shipState.dps.multiplier}</div>
                        </div>
                        <div className='ship-item-container-right'>
                            <img src={plus} className='item-plus' onClick={() => buyShip('dps', 1)} alt='plus'></img>
                        </div>
                    </div>

                    <div className='ship-item'>
                        <div className='ship-item-container-left'>
                            <img src={bullets} className='ship-item-img' alt='bullets'></img>
                            <div className='ship-item-lv'>Lv.{shipState.damageDealt.level}</div>
                            <div>Upgrade damage dealt</div>
                            <div className='money-container'><img src={gold} className='money-logo' alt='gold'></img> {shipState.damageDealt.cost}</div>
                            <div>x{shipState.damageDealt.multiplier}</div>
                        </div>
                        <div className='ship-item-container-right'>
                            <img src={plus} className='item-plus' onClick={() => buyShip('damageDealt', 2)} alt='plus'></img>
                        </div>
                    </div>

                    <div className='ship-item'>
                        <div className='ship-item-container-left'>
                            <img src={critHitGrad} className='ship-item-img' alt='crithitGrad'></img>
                            <div className='ship-item-lv'>Lv.{shipState.critChance.level}</div>
                            <div>Upgrade critical hit chance</div>
                            <div className='money-container'><img src={gold} className='money-logo' alt='gold'></img> {shipState.critChance.cost}</div>
                            <div>x{shipState.critChance.multiplier}</div>
                        </div>
                        <div className='ship-item-container-right'>
                            <img src={plus} className='item-plus' onClick={() => buyShip('critChance', 3)} alt='plus'></img>
                        </div>
                    </div>

                    <div className='ship-item'>
                        <div className='ship-item-container-left'>
                            <img src={coin} className='ship-item-img' alt='coin'></img>
                            <div className='ship-item-lv'>Lv.{shipState.gold.level}</div>
                            <div>Upgrade gold gained from destroying planets</div>
                            <div className='money-container'><img src={gold} className='money-logo' alt='gold'></img> {shipState.gold.cost}</div>
                            <div>x{shipState.gold.multiplier}</div>
                        </div>
                        <div className='ship-item-container-right'>
                            <img src={plus} className='item-plus' onClick={() => buyShip('gold', 4)} alt='plus'></img>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}