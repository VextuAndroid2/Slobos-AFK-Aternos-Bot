const mineflayer = require("mineflayer");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");

const bot = mineflayer.createBot({
    host: "mc.realslow.site",
    port: 50526,
    username: "BotAfk2",
    version: "1.20.1",
    checkTimeoutInterval: 60000
});

bot.loadPlugin(pathfinder);

bot.on("message", (msg) => {
    let text = msg.toString().toLowerCase();
    
    // Lógica de Registro
    if (text.includes("register") || text.includes("registrar")) {
        bot.chat("/register vextubot vextubot");
    }
    
    // Lógica de Login
    if (text.includes("login") || text.includes("iniciar sesión")) {
        bot.chat("/login vextubot");
    }

    // Al loguearse correctamente, empezamos a caminar
    if (text.includes("logueado") || text.includes("exitoso") || text.includes("iniciado")) {
        console.log("Sesión iniciada, iniciando movimiento...");
        setInterval(caminarEnCírculos, 5000);
    }
});

function caminarEnCírculos() {
    if (!bot.entity) return;
    const mcData = require("minecraft-data")(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);

    // Movimiento en patrón de círculo simple
    const pos = bot.entity.position;
    const angle = Date.now() / 2000;
    const x = Math.sin(angle) * 3;
    const z = Math.cos(angle) * 3;

    bot.pathfinder.setGoal(new goals.GoalBlock(Math.floor(pos.x + x), Math.floor(pos.y), Math.floor(pos.z + z)));
}

bot.on("error", (err) => console.log("ERROR:", err.message));
bot.on("kicked", (reason) => console.log("KICK:", reason));
