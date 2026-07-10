const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

app.use(express.static('public'));

let bot = null;

io.on('connection', (socket) => {
    socket.on('iniciar', (config) => {
        if (bot) return socket.emit('log', 'Bot ya activo');
        
        bot = mineflayer.createBot({
            host: config.host,
            port: parseInt(config.port),
            username: config.username,
            version: "1.20.1"
        });

        bot.loadPlugin(pathfinder);

        bot.on('spawn', () => socket.emit('log', 'Bot conectado y logueado.'));
        bot.on('message', (msg) => socket.emit('log', msg.toString()));
        bot.on('kicked', (r) => socket.emit('log', 'Kicked: ' + r));
        bot.on('error', (e) => socket.emit('log', 'Error: ' + e.message));
    });

    socket.on('comando', (cmd) => {
        if (bot) bot.chat(cmd);
    });
});

http.listen(process.env.PORT || 3000);
