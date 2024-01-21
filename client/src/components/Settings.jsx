import x from '../assets/env/x.svg';

import { useState } from 'react';

export default function Settings({ 
    toggleSettings, 
    toggleAllAnim, 
    toggleHitAnim, 
    toggleDmgAnim,
    togglePlanetAnim,
    allAnim,
    hitAnim,
    dmgAnim,
    planetAnim
}) {

    return (
        
        <>
            <div className='navbar-settings-toggle' onClick={toggleSettings}></div>
            <div className='navbar-settings'>
                <div className='navbar-settings-relative'>
                    <div className='navbar-settings-title'>Settings</div>
                    <img src={x} className='navbar-settings-close' onClick={toggleSettings} alt='close-settings'></img>
                </div>
                {/* <div className='option'>
                    <input type="checkbox" className="switch"/>
                    <label>Toggle animations: On/Off</label>
                </div>
                <div>Toggle hit animation: On/Off</div>
                <div>Toggle critical hit animation: On/Off</div> */}
            <form>
                <div className='option'>
                    <input type="checkbox" id="option1" name="option1" onClick={toggleAllAnim} checked={allAnim} onChange={() => {}} className="switch"/>
                    <label htmlFor="option1">On/Off All animations</label>
                </div>
                <div className="option">
                    <input type="checkbox" id="option2" name="option2" onClick={toggleHitAnim} checked={hitAnim} onChange={() => {}} className="switch"/>
                    <label htmlFor="option2">On/Off Hit animation</label>
                </div>
                <div className="option">
                    <input type="checkbox" id="option3" name="option3" onClick={toggleDmgAnim} checked={dmgAnim} onChange={() => {}} className="switch"/>
                    <label htmlFor="option3">On/Off Dealt damage animation</label>
                </div>
                <div className="option">
                    <input type="checkbox" id="option4" name="option4" onClick={togglePlanetAnim} checked={planetAnim} onChange={() => {}} className="switch"/>
                    <label htmlFor="option4">On/Off Planet reset animation</label>
                </div>
            </form>
            </div>
        </>
    );
}