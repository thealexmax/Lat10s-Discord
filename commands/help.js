const { MessageEmbed } = require('discord.js');
const { prefix } = require('../config.json');
module.exports = {
	name: 'help',
	description: 'Help menu',
	execute(message) {
        // Color: #198de0
        let helpMenu = new MessageEmbed()
        .setColor("#198de0").setTitle("Latios Help Menu")
        .setAuthor(message.guild.me.client.user.username)
        .addFields(
            { name: `${prefix}play <Youtube URL/Playlist URL/Song Name>`, value: 'Plays a song/playlist' },
            { name: `${prefix}loop`, value: 'Will put the current song on loop or disable current loop' },
            { name: `${prefix}stop`, value: `Will stop the current music player session and clear the queue` },
            { name: `${prefix}skip`, value: 'Will skip to the next song in the queue' },
            { name: `${prefix}playlist <Name>`, value: 'Will play said playlist' },
            { name: `${prefix}playlist add <Name> <Youtube URL>`, vale: 'Latios will remember that playlist OwO' },
            { name: `${prefix}playlist list`, value: 'Will display the 10 most played playlists in the server' });
		message.channel.send(helpMenu);
	},
};