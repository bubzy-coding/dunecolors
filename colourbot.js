import { Client, GatewayIntentBits } from "discord.js";

// create client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const token = process.env.DISCORD_TOKEN;

// same color definitions you used
const colors = [
    [255, 100, 100],   // red
    [212, 175, 55],    // Highlight
    [230, 190, 138],   // Chat_Body
    [255, 127, 39],    // Chat_Prox
    [255, 192, 111],   // Chat_Map
    [97, 57, 103],     // Chat_Whisper
    [100, 100, 255],   // Chat_Party
    [100, 255, 100],   // Chat_Guild
    [255, 255, 255]    // NpcText
];

const colorNames = [
    "Red",
    "Highlight",
    "Chat_Body",
    "Chat_Prox",
    "Chat_Map",
    "Chat_Whisper",
    "Chat_Party",
    "Chat_Guild",
    "NpcText"
];

// take a string and apply random colours letter by letter
function randomizeColors(text) {
    let chars = [];

    for (const letter of text) {
        const i = Math.floor(Math.random() * colors.length);
        chars.push({
            letter,
            colorName: colorNames[i]
        });
    }

    return renderOutput(chars, 250); // hard limit
}

function renderOutput(chars, limit = 250) {
    if (chars.length === 0) return "";
    let out = "";
    let prevColor = null;

    for (const ch of chars) {
        // build the next chunk we *might* append
        let chunk = "";

        if (
            ch.colorName !== prevColor &&
            !(ch.letter === " " && ch.colorName === "NpcText")
        ) {
            chunk += `</><${ch.colorName}>`;
            prevColor = ch.colorName;
        }

        chunk += ch.letter;

        // check if adding this chunk breaks the limit
        if (out.length + chunk.length > limit) break;
        out += chunk;
    }

    return out.trim();
}


// Discord message handler
client.on("messageCreate", (msg) => {
    if (msg.author.bot) return;

    // !random or !color command
    if (msg.content.startsWith("!dunecol")) {
        const text = msg.content.replace("!dunecol", "").trim();
        if (!text) {
            msg.reply("Give me something to colorize, human.");
            return;
        }

        const colored = randomizeColors(text);

        // send as code block so Discord doesn’t format it
        msg.reply("```" + colored + "```");
    }
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(token);
