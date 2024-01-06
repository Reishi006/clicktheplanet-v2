import '../main/Main.css';
import { useState } from 'react';
import {
    radiation,
    bullets,
    critHitGrad,
    coin,
    lock,
    plus,
} from '../assets/img-import.js';

export default function Ship() {



    return (
        <>
            <div className='menu-container'>
                <div className='title'>Ship</div>
                <div className='ship-items-container'>
                    <div className='ship-item'>
                        <div className='ship-item-container-left'>
                            <img src={radiation} className='ship-item-img' alt='radiation'></img>
                            <div className='ship-item-lv'>Lv.124Q</div> 
                            <div>Boost damage per second (DPS)</div>
                        </div>
                        <div className='ship-item-container-right'>
                            <img src={plus} className='item-plus' alt='plus'></img>
                        </div>
                    </div>

                    <div className='ship-item'>
                        <div className='ship-item-container-left'>
                            <img src={bullets} className='ship-item-img' alt='bullets'></img>
                            <div className='ship-item-lv'>Lv.11956T</div>
                            <div>Upgrade damage dealt</div>
                        </div>
                        <div className='ship-item-container-right'>
                            <img src={plus} className='item-plus' alt='plus'></img>
                        </div>
                    </div>

                    <div className='ship-item'>
                        <div className='ship-item-container-left'>
                            <img src={critHitGrad} className='ship-item-img' alt='crithitGrad'></img>
                            <div className='ship-item-lv'>Lv.74124B</div>
                            <div>Upgrade critical hit chance</div>
                        </div>
                        <div className='ship-item-container-right'>
                            <img src={plus} className='item-plus' alt='plus'></img>
                        </div>
                    </div>

                    <div className='ship-item'>
                        <div className='ship-item-container-left'>
                            <img src={coin} className='ship-item-img' alt='coin'></img>
                            <div className='ship-item-lv'>Lv.384K</div>
                            <div>Upgrade gold gained from destroying planets</div>
                        </div>
                        <div className='ship-item-container-right'>
                            <img src={plus} className='item-plus' alt='plus'></img>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}