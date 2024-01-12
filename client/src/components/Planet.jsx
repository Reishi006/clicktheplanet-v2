import { useState } from 'react';

export default function Planet({ 
    randColor, 
    planets, 
    randomPlanet, 
    handlePlanet, 
    handleArrowLeft, 
    skipArrowLeft, 
    handleArrowRight, 
    skipArrowRight,
    planetState,
    setPlanetState,
}) {

    return (
        <>
            <div className='planet-state'>
                <div className='planet-level'>Level: {planetState.currentLevel}</div>
                <div className='planet-stage'>{planetState.currentStage}/10</div>
                <div className='planet-name'>{planetState.name}</div>
            </div>

            <div>

                <div className='main-planet' 
                style={{ 
                    '--breatheColor' : randColor.randPlanet,
                    filter : `hue-rotate(${randColor.randHue}deg)`,
                }}
                >
                    <img 
                        src={planets[randomPlanet]} 
                        className='planet-img'
                        onClick={()=>handlePlanet()} 
                        alt='planet'
                    ></img>
                    <div className='advance-arrow-left' onClick={handleArrowLeft}>
                        <img 
                        src={skipArrowLeft} 
                        className='skip-arrow' 
                        alt='skip-arrow-left'
                        ></img>
                    </div>
                    <div className='advance-arrow-right' onClick={handleArrowRight}>
                        <img 
                        src={skipArrowRight} 
                        className='skip-arrow' 
                        alt='skip-arrow-right'
                        ></img>
                    </div>
                </div>
                <div className='planet-health-text'>HP: {planetState.currentHp}/{planetState.maxHp}</div>
                <div className='planet-health-container'>
                    <div className='planet-health-under'>
                        <div className='planet-health' style={{ width: `${(planetState.currentHp * 100)/planetState.maxHp}%` }}></div>
                    </div>
                </div>

            </div>

            <div className='spacer-div'>

            </div>
        </>
    )
}