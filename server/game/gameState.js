const express = require('express');
const app = express();
const uuid = require('uuid');
const cookie = require('cookie');

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const { checkAuth } = require('../routes/auth.js');
const db = require('../db.js');
const gameState = require('./gameStateObj.js');
const { privateDecrypt } = require('crypto');

process.on('currentUserIdSet', (userId) => {
    console.log(`currentUserIdSet: ${userId}`); //global variable for connected user
});

let resetPlanet = false;
let advance = true;

const calculatePlanet = () => {
    if (gameState.planet.currentLevel == 1) {
        gameState.planet.maxHp = 10;
        gameState.planet.currentHp = gameState.planet.maxHp;
        return;
    }
    gameState.planet.maxHp = (((gameState.planet.currentLevel*2)**2)) - gameState.planet.currentLevel**2;
    gameState.planet.currentHp = gameState.planet.maxHp;
}

const advancePlanet = () => {
    gameState.planet.currentStage = gameState.planet.currentStage + 1;
    gameState.planet.maxStage = gameState.planet.maxStage + 1;
    if (gameState.planet.maxStage > 10 && gameState.planet.currentStage > 10) {
        gameState.planet.currentStage = 0;
        gameState.planet.maxStage = 0;
        gameState.planet.maxLevel += 1;
        gameState.planet.currentLevel = gameState.planet.maxLevel;
        calculatePlanet();
        if (gameState.planet.currentLevel >= gameState.planet.maxLevel) gameState.planet.maxLevel = gameState.planet.currentLevel;

        db.query('UPDATE game JOIN users ON game.id = users.game_id SET currentlevel = ?, maxlevel = ?, currentstage = ?, maxstage = ? WHERE users.id = ?', 
        [gameState.planet.currentLevel, gameState.planet.maxLevel, gameState.planet.currentStage, gameState.planet.maxStage, userId], (err, data) => {
            if (err) throw err;
            console.log('%c levels updated', 'color: lightgreen');
        });
    } else {
        db.query('UPDATE game JOIN users ON game.id = users.game_id SET currentstage = ?, maxstage = ? WHERE users.id = ?', 
        [gameState.planet.currentStage, gameState.planet.maxStage, userId], (err, data) => {
            if (err) throw err;
            console.log('%c stage updated', 'color: lightblue');
        });
    }
}

const hitPlanet = () => {
    gameState.planet.currentHp -= gameState.player.currentDamage;
    if (gameState.planet.currentHp <= 0) {
        calculatePlanet();
        resetPlanet = true;
        if (advance) advancePlanet();
    } else {
        resetPlanet = false;
    }
}

const arrowLeft = () => {
    advance = false;
    gameState.planet.currentHp = gameState.planet.maxHp;
    if (gameState.planet.currentLevel > 1) {
        gameState.planet.currentLevel -= 1;
        gameState.planet.currentStage = 10;

        calculatePlanet();

        resetPlanet = true;

        db.query('UPDATE game JOIN users ON game.id = users.game_id SET currentlevel = ?, currentstage = ? WHERE users.id = ?', 
        [gameState.planet.currentLevel, gameState.planet.currentStage, userId], (err, data) => {
            if (err) throw err;
            console.log('%c levels updated', 'color: lightgreen');
        });
    } else {
        resetPlanet = false;
    }
}

const arrowRight = () => {
    advance = false;
    
    if (gameState.planet.currentLevel < gameState.planet.maxLevel && gameState.planet.currentLevel != gameState.planet.maxLevel) {
        gameState.planet.currentLevel += 1;
        gameState.planet.currentStage = 10;
        calculatePlanet();
        resetPlanet = true;

        if (gameState.planet.currentLevel === gameState.planet.maxLevel) {
            advance = true;
            gameState.planet.currentStage = gameState.planet.maxStage;
            console.log(`arrowRight currentStage: ${gameState.planet.currentStage}`);
        }

        db.query('UPDATE game JOIN users ON game.id = users.game_id SET currentlevel = ?, currentstage = ? WHERE users.id = ?', 
        [gameState.planet.currentLevel, gameState.planet.currentStage, userId], (err, data) => {
            if (err) throw err;
            //console.log('%c levels updated', 'color: lightgreen');
        });
    } else if (gameState.planet.currentLevel === gameState.planet.maxLevel) {
        advance = true;
        resetPlanet = false;
        gameState.planet.currentStage = gameState.planet.maxStage;
        console.log(`arrowRight currentStage: ${gameState.planet.currentStage}`);

        db.query('UPDATE game JOIN users ON game.id = users.game_id SET currentlevel = ?, currentstage = ? WHERE users.id = ?', 
        [gameState.planet.currentLevel, gameState.planet.currentStage, userId], (err, data) => {
            if (err) throw err;
            //console.log('%c levels updated', 'color: lightgreen');
        });
    }
}

module.exports = {
    getIo: (server) => {
        const io = new Server(server, {
            cors: {
                origin: 'http://localhost:3000',
                methods: ['GET', 'POST'],
                credentials: true,
            }
        });
        io.on("connection", (socket) => {
            console.log(`Socket from gameState: ${socket.id}`);

            console.log(`userId socket: ${typeof userId} ${userId}`);

            const roomId = uuid.v4(); // Generate a unique ID
            socket.join(roomId); // Assign the player to a unique room
            console.log(roomId);

            
            //socket.to(roomId).emit('receive_setall', gameState);

            socket.on('sendclick', () => {
                hitPlanet();
                //console.log(gameState.planet.currentHp);
                socket.emit('receiveclick', {gameState: gameState, resetPlanet: resetPlanet});
            });

            socket.on('arrowleft', () => {
                arrowLeft();
                console.log('arrowleft currentLevel: ' + gameState.planet.currentLevel);
                console.log('arrowleft maxLevel: ' + gameState.planet.maxLevel);
                socket.emit('receivearrowleft', {gameState: gameState, resetPlanet: resetPlanet});
            });

            socket.on('arrowright', () => {
                arrowRight();
                console.log('arrowright');
                //console.log(gameState.planet.currentHp);
                socket.emit('receivearrowright', {gameState: gameState, resetPlanet: resetPlanet});
            });
        });

        return io;
    }
}
