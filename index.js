const mineflayer = require("mineflayer");
const express = require("express");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Bot RealSlow activo");
});

app.listen(PORT, () => {
    console.log(`Servidor Node.js iniciado en puerto ${PORT}`);
});

const bot = mineflayer.createBot({
    host: "mc.realslow.site",
    port: 50526,
    username: "BotAfk",
    version: "1.20.1",
    checkTimeoutInterval: 60000
});

bot.loadPlugin(pathfinder);

let caminando = false;

bot.on("message", (msg) => {
    let text = msg.toString().toLowerCase();

    if (text.includes("register") || text.includes("registrar")) {
        bot.chat("/register vextubot vextubot");
    }

    if (text.includes("login") || text.includes("iniciar sesión")) {
        bot.chat("/login vextubot");
    }

    if (
        text.includes("logueado") ||
        text.includes("exitoso") ||
        text.includes("iniciado")
    ) {
        if (!caminando) {
            console.log("Sesión iniciada, iniciando movimiento...");
            caminando = true;
            setInterval(caminarEnCírculos, 5000);
        }
    }
});

function caminarEnCírculos() {
    if (!bot.entity) return;

    const mcData = require("minecraft-data")(bot.version);
    const defaultMove = new Movements(bot, mcData);

    bot.pathfinder.setMovements(defaultMove);

    const pos = bot.entity.position;
    const angle = Date.now() / 2000;

    const x = Math.sin(angle) * 3;
    const z = Math.cos(angle) * 3;

    bot.pathfinder.setGoal(
        new goals.GoalBlock(
            Math.floor(pos.x + x),
            Math.floor(pos.y),
            Math.floor(pos.z + z)
        )
    );
}

bot.on("spawn", () => {
    console.log("Bot conectado a mc.realslow.site:50526");
});

bot.on("error", (err) => {
    console.log("ERROR:", err.message);
});

bot.on("kicked", (reason) => {
    console.log("KICK:", reason);
});

bot.on("end", () => {
    console.log("Bot desconectado");
});
