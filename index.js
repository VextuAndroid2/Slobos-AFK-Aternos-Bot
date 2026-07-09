const mineflayer = require("mineflayer");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const http = require("http");

// --- MANTENER VIVO EN RENDER ---
// Esto abre el puerto que Render requiere
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot activo');
}).listen(PORT, () => {
    console.log(`Servidor HTTP de control iniciado en el puerto ${PORT}`);
});

// --- BOT DE MINECRAFT ---
const bot = mineflayer.createBot({
    host: "mc.realslow.site",
    port: 50526,
    username: "BotAfk",
    version: "1.20.1",
    checkTimeoutInterval: 60000
});

bot.loadPlugin(pathfinder);

bot.on("message", (msg) => {
    let text = msg.toString().toLowerCase();
    
    if (text.includes("register") || text.includes("registrar")) {
        bot.chat("/register vextubot vextubot");
    }
    
    if (text.includes("login") || text.includes("iniciar sesión")) {
        bot.chat("/login vextubot");
    }

    if (text.includes("logueado") || text.includes("exitoso") || text.includes("iniciado")) {
        console.log("Sesión iniciada, iniciando movimiento...");
        // Usamos setInterval una sola vez al entrar
        if (!bot.caminando) {
            bot.caminando = setInterval(caminarEnCírculos, 5000);
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

    bot.pathfinder.setGoal(new goals.GoalBlock(Math.floor(pos.x + x), Math.floor(pos.y), Math.floor(pos.z + z)));
}

bot.on("error", (err) => console.log("ERROR:", err.message));
bot.on("kicked", (reason) => {
    console.log("KICK:", reason);
    if (bot.caminando) clearInterval(bot.caminando);
});
