import '../main/Main.css';
import { useState } from 'react';
import {
    gold, diamond,
    laserGunBlue, laserGunGreen, laserGunRed,
    plus, lock,
} from '../assets/img-import.js';

export default function Store({ itemState, buyItem }) {



    return (
        <>
            <div className='menu-container'>
                <div className='title'>Store</div>
                <div className='store-items-container'>
                    <div className='store-item'>
                        <div className='store-item-container-left'>
                            <img src={laserGunBlue} className='store-item-img' alt='lasergunblue'></img>
                            <div className='store-item-lv'>Lv.{itemState.blueLaserGun.level}</div>
                        </div>
                        <div className='store-item-desc'>Blue Laser Gun</div>
                        <div>Damage: {itemState.blueLaserGun.damage}</div>
                        <div className='money-container'><img src={gold} className='money-logo' alt='gold'></img> {itemState.blueLaserGun.cost}</div>
                        <img src={plus} className='item-plus' onClick={() => buyItem('blueLaserGun', 1)} alt='plus'></img>
                    </div>

                    {itemState.blueLaserGun.level > 0 ? <div className='store-item'>
                        <div className='store-item-container-left'>
                            <img src={laserGunGreen} className='store-item-img' alt='lasergungreen'></img>
                            <div className='store-item-lv'>Lv.{itemState.greenLaserGun.level}</div>
                        </div>
                        <div className='store-item-desc'>Green Laser Gun</div>
                        <div>Damage: {itemState.greenLaserGun.damage}</div>
                        <div className='money-container'><img src={gold} className='money-logo' alt='gold'></img> {itemState.greenLaserGun.cost}</div>
                        <img src={plus} className='item-plus' onClick={() => buyItem('greenLaserGun', 2)} alt='plus'></img>
                    </div> :
                        itemState.blueLaserGun.level === 0 && 
                        <div className='store-item-lock'>
                            <img src={lock} className='store-item-img' alt='lock'></img>
                        </div>
                    }

                    {itemState.greenLaserGun.level > 0 ? <div className='store-item'>
                        <div className='store-item-container-left'>
                            <img src={laserGunRed} className='store-item-img' alt='lasergunred'></img>
                            <div className='store-item-lv'>Lv.{itemState.redLaserGun.level}</div>
                        </div>
                        <div className='store-item-desc'>Red Laser Gun</div>
                        <div>Damage: {itemState.redLaserGun.damage}</div>
                        <div className='money-container'><img src={gold} className='money-logo' alt='gold'></img> {itemState.redLaserGun.cost}</div>
                        <img src={plus} className='item-plus' onClick={() => buyItem('redLaserGun', 3)} alt='plus'></img>
                    </div> :
                        <div className='store-item-lock'>
                            <img src={lock} className='store-item-img' alt='lock'></img>
                        </div>
                    }
                    
                    {itemState.purpleLaserGun.level > 0 ? <div className='store-item'>
                        <div className='store-item-container-left'>
                            <img src={laserGunRed} className='store-item-img' style={{'filter' : 'hue-rotate(270deg)'}} alt='lasergunred'></img>
                            <div className='store-item-lv'>Lv.{itemState.purpleLaserGun.level}</div>
                        </div>
                        <div className='store-item-desc'>Purple Laser Gun</div>
                        <div>Damage: {itemState.purpleLaserGun.damage}</div>
                        <div className='money-container'><img src={gold} className='money-logo' alt='gold'></img> {itemState.purpleLaserGun.cost}</div>
                        <img src={plus} className='item-plus' /* onClick={() => buyItem('purpleLaserGun', 4)} */ alt='plus'></img>
                    </div> :
                        itemState.redLaserGun.level === 0 && 
                        <div className='store-item-lock'>
                            <img src={lock} className='store-item-img' alt='lock'></img>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}