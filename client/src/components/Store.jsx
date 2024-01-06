import '../main/Main.css';
import { useState } from 'react';
import {
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
                            <div>Item_one</div>
                        </div>
                        <img src={plus} className='item-plus' alt='plus'></img>
                    </div>
                    <div className='store-item'>
                        <div className='store-item-container-left'>
                            <img src={laserGunGreen} className='store-item-img' alt='lasergungreen'></img>
                            <div className='store-item-lv'>Lv.10000M</div>                    
                            <div>Item_two two</div>
                        </div>
                        <img src={plus} className='item-plus' alt='plus'></img>
                    </div>
                    <div className='store-item'>
                        <div className='store-item-container-left'>
                            <img src={laserGunRed} className='store-item-img' alt='lasergunred'></img>
                            <div className='store-item-lv'>Lv.4539K</div>
                            <div>Item_three three three</div>
                        </div>
                        <img src={plus} className='item-plus' alt='plus'></img>
                    </div>
                    <div className='store-item'>
                        <div className='store-item-container-left'>
                            <img src={laserGunRed} className='store-item-img' style={{'filter' : 'hue-rotate(270deg)'}} alt='lasergunred'></img>
                            <div className='store-item-lv'>Lv.4539K</div>
                            <div>Item_Four four four four</div>
                        </div>
                        <img src={plus} className='item-plus' alt='plus'></img>
                    </div>
                </div>
            </div>
        </>
    )
}