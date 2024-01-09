import '../main/Main.css';
import { useState } from 'react';
import {
    gold, diamond,
    laserGunBlue, laserGunGreen, laserGunRed,
    plus,
} from '../assets/img-import.js';

export default function Store() {



    return (
        <>
            <div className='menu-container'>
                <div className='title'>Store</div>
                <div className='store-items-container'>
                    <div className='store-item'>
                        <div className='store-item-container-left'>
                            <img src={laserGunBlue} className='store-item-img' alt='lasergunblue'></img>
                            <div className='store-item-lv'>Lv.685B</div>
                        </div>
                        <div className='store-item-desc'>Blue Laser Gun</div>
                        <div>Damage: 105</div>
                        <div className='money-container'><img src={gold} className='money-logo' alt='gold'></img> 563K</div>
                        <img src={plus} className='item-plus' alt='plus'></img>
                    </div>
                    <div className='store-item'>
                        <div className='store-item-container-left'>
                            <img src={laserGunGreen} className='store-item-img' alt='lasergungreen'></img>
                            <div className='store-item-lv'>Lv.10000M</div>
                        </div>
                        <div className='store-item-desc'>Green Laser Gun</div>
                        <div>Damage: 5612</div>
                        <div className='money-container'><img src={gold} className='money-logo' alt='gold'></img> 65704K</div>
                        <img src={plus} className='item-plus' alt='plus'></img>
                    </div>
                    <div className='store-item'>
                        <div className='store-item-container-left'>
                            <img src={laserGunRed} className='store-item-img' alt='lasergunred'></img>
                            <div className='store-item-lv'>Lv.4539K</div>
                        </div>
                        <div className='store-item-desc'>Red Laser Gun</div>
                        <div>Damage: 67012</div>
                        <div className='money-container'><img src={gold} className='money-logo' alt='gold'></img> 563M</div>
                        <img src={plus} className='item-plus' alt='plus'></img>
                    </div>
                    <div className='store-item'>
                        <div className='store-item-container-left'>
                            <img src={laserGunRed} className='store-item-img' style={{'filter' : 'hue-rotate(270deg)'}} alt='lasergunred'></img>
                            <div className='store-item-lv'>Lv.4539K</div>
                        </div>
                        <div className='store-item-desc'>Purple Laser Gun</div>
                        <div>Damage: 67012</div>
                        <div className='money-container'><img src={gold} className='money-logo' alt='gold'></img> 783B</div>
                        <img src={plus} className='item-plus' alt='plus'></img>
                    </div>
                </div>
            </div>
        </>
    )
}