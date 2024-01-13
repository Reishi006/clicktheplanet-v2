const gameState = {
    player: {
        gold: 100,
        diamonds: 100,
        currentDamage: 20000,
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
        goldReward: 1,
        bossModifier: 5,
    },
    items: {
        blueLaserGun: {
            level: 0,
            cost: 100,
        },
        greenLaserGun: {
            level: 0,
            cost: 1000,
        },
        redLaserGun: {
            level: 0,
            cost: 25000,
        },
        purpleLaserGun: {
            level: 0,
            cost: 125000,
        },
        
    }
}

module.exports = gameState;