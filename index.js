const mineflayer = require('mineflayer');
const AutoAuth = require('mineflayer-auto-auth');
const socketIo = require('socket.io-client');

// Create a bot
const bot = mineflayer.createBot({
    host: '247jay.aternos.me',
    port: 34732,
    username: 'YourBotUsername',
    plugins: [AutoAuth],
    AutoAuth: {
        logging: true,
        password: 'password',
        ignoreRepeat: true
    }
});

// Function to look at the nearest player
function lookAtNearestPlayer() {
    const player = bot.nearestEntity(entity => entity.type === 'player');
    if (player) {
        const pos = player.position;
        bot.lookAt(pos);
    }
}

// Event handler for when the bot is ready
bot.once('spawn', () => {
    console.log('Bot spawned');

    // Set up periodic actions for AFK behavior
    setInterval(() => {
        lookAtNearestPlayer(); // Look at the nearest player periodically
        // Add more actions here as needed for other AFK behavior
    }, 60 * 1000); // Perform actions every minute (adjust interval as needed)
});

// Event handler for chat messages
bot.on('chat', (username, message) => {
    // Log chat messages
    console.log(`${username}: ${message}`);

    // Example: Respond to a specific message
    if (message === 'Hello bot') {
        bot.chat('Hello!');
    }
});

// Event handler for when the bot is kicked from the server
bot.on('kicked', reason => {
    console.log(`Kicked from server: ${reason}`);
    // Attempt to reconnect
    setTimeout(() => {
        bot.quit(); // Disconnect before reconnecting
        bot.connect(); // Reconnect
    }, 5000); // Attempt to reconnect after 5 seconds
});

// Event handler for errors
bot.on('error', err => {
    console.error('Bot error:', err);
});

// Event handler for successful server authentication
bot.on('serverAuth', () => {
    console.log('Bot authenticated on the server');
});

// Event handler for disconnect
bot.on('end', () => {
    console.log('Bot disconnected from the server');
});

module.exports = async (req, res) => {
    const currentUrl = `${req.headers['x-forwarded-proto']}://${req.headers['host']}${req.url}`;
    res.send(`Your Bot Is Ready! Bot made by Jay<br>Link Web For Uptime: <a href="${currentUrl}">${currentUrl}</a>`);
};
