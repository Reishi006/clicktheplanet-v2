const gameState = {
    player: {
        gold: 100,
        diamonds: 100,
        currentDamage: 1,
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
            damage: 0,
            baseCost: 100,
            baseDamage: 1,
        },
        greenLaserGun: {
            level: 0,
            cost: 1000,
            damage: 0,
            baseCost: 1000,
            baseDamage: 10,
        },
        redLaserGun: {
            level: 0,
            cost: 25000,
            damage: 0,
            baseCost: 25000,
            baseDamage: 100,
        },
        purpleLaserGun: {
            level: 0,
            cost: 125000,
            damage: 0,
            baseCost: 125000,
            baseDamage: 500,
        },
        
    },
    ship: {
        dps: {
            level: 0,
            cost: 10000,
            baseCost: 100000,
            baseDamage: 1,
        },
        damageDealt: {
            level: 0,
            cost: 100000,
            baseCost: 100000,
            baseMultiplier: 1.05,
        },
        critChance: {
            level: 0,
            cost: 100000,
            baseChance: 0.01,
        },
        gold: {
            level: 0,
            cost: 100000,
            baseMultiplier: 1.05,
        }
    }
}

module.exports = gameState;