import { store, ship, stats, guild, wheel, admin, } from '../assets/img-import.js';


export default function Drawer({ setShow, openChat }) {

    const twoFunctions = () => {
        setShow(3); 
        openChat();
    }

    return (
        <div className='drawer-container'>
            <div className='drawer-element' onClick={() => setShow(0)}><img src={store} className='drawer-icon' alt='store'></img></div>
            <div className='drawer-element' onClick={() => setShow(1)}><img src={ship} className='drawer-icon' alt='ship'></img></div>
            <div className='drawer-element' onClick={() => setShow(2)}><img src={stats} className='drawer-icon' alt='stats'></img></div>
            <div className='drawer-element' onClick={() => twoFunctions()}><img src={guild} className='drawer-icon' alt='guild'></img></div>
            <div className='drawer-element' onClick={() => setShow(4)}><img src={wheel} className='drawer-icon' alt='wheel'></img></div>
            <div className='drawer-element' onClick={() => setShow(5)}><img src={admin} className='drawer-icon' alt='admin'></img></div>
        </div>
    )
}