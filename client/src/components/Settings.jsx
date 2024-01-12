import x from '../assets/env/x.svg';

export default function Settings({ toggleSettings }) {


    return (
        
        <>
            <div className='navbar-settings-toggle' onClick={toggleSettings}></div>
            <div className='navbar-settings'>
                <div className='navbar-settings-relative'>
                    <div className='navbar-settings-title'>Settings</div>
                    <img src={x} className='navbar-settings-close' onClick={toggleSettings} alt='close-settings'></img>
                </div>
                <div>Toggle animations: On/Off</div>
                <div>Toggle hit animation: On/Off</div>
                <div>Toggle critical hit animation: On/Off</div>
            </div>
        </>
    );
}