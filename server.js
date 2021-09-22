const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.queue = new Map();
client.loop = new Map();

client.on('message', msg => {
	if(!msg.content.startsWith(config.prefix) || msg.author.bot) return;
	const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	if(!client.commands.has(command)) return;
	try {
		client.commands.get(command).execute(msg, args);
	}
	catch(error) {
		console.error(error);
		msg.reply('There was an error trying to execute that command');
	}
});

client.login(config.token);
