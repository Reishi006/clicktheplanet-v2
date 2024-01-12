const gameState = {
    player: {
        gold: 100,
        diamonds: 100,
        currentDamage: 1000,
        critChance: 0.1,
        totalDamage: 0,
    },
    planet: {
        currentLevel: 1,
        maxLevel: 1,
        currentStage: 1,
        maxStage: 1,
        currentHp: 80,
        maxHp: 100,
    },
    items: {
        blueLaserGun: {
            level: 0,
            cost: 0,
        },
        greenLaserGun: {
            level: 0,
            cost: 0,
        },
        redLaserGun: {
            level: 0,
            cost: 0,
        },
        purpleLaserGun: {
            level: 0,
            cost: 0,
        },
        
    }
}

module.exports = gameState;