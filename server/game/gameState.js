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



process.on('currentUserIdSet', (userId) => {
    console.log(`currentUserIdSet: ${userId}`); //global variable for connected user
});

let resetPlanet = false;


const advancePlanet = () => {
    gameState.planet.stage = gameState.planet.stage + 1;
    if (gameState.planet.stage > 10) {
        gameState.planet.stage = 0;
        gameState.planet.currentLevel = gameState.planet.currentLevel + 1;
        if (gameState.planet.currentLevel >= gameState.planet.maxLevel) gameState.planet.maxLevel = gameState.planet.currentLevel;

        db.query('UPDATE game JOIN users ON game.id = users.game_id SET currentlevel = ?, maxlevel = ?, stage = ? WHERE users.id = ?', 
        [gameState.planet.currentLevel, gameState.planet.maxLevel, gameState.planet.stage, userId], (err, data) => {
            if (err) throw err;
            console.log('%c levels updated', 'color: lightgreen');
        });
    } else {
        db.query('UPDATE game JOIN users ON game.id = users.game_id SET stage = ? WHERE users.id = ?', 
        [gameState.planet.stage, userId], (err, data) => {
            if (err) throw err;
            console.log('%c stage updated', 'color: lightblue');
        });
    }
}

const hitPlanet = () => {
    gameState.planet.currentHp -= 10;
    if (gameState.planet.currentHp <= 0) {
        gameState.planet.currentHp = gameState.planet.maxHp;
        resetPlanet = true;
        advancePlanet();
    } else {
        resetPlanet = false;
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
                socket.emit('receiveclick', {gameState: gameState, resetPlanet: resetPlanet});
                hitPlanet();
            });
        });

        return io;
    }
}
