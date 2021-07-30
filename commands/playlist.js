const playlistDB = require('../includes/playlistManager');
const { play } = require('../includes/play');
const config = require('../config.json');
const ytapi = require('simple-youtube-api');
const Youtube = new ytapi(config.ytapi);

module.exports = {
	name: 'playlist',
	description: 'Saves/Plays a playlist',
	async execute(message, args) {
		if(!message.member.voice.channelID) {
			return message.reply('You are not in a voice channel');
		}
		if (args[0] == 'add') {
			if(!args[2].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/g)) {
				return message.reply('I need you to provide me with a youtube playlist URL');
			}
			const playlist = await playlistDB.createPlaylist(message.guild.id, message.member.id, args[1], args[2]);
			if(playlist === 0) {
				return message.reply('Playlist added');
			}
			else if(playlist === 1) {
				return message.reply('That playlist already exists');
			}
			else if(playlist === 2) {
				return message.reply('Unknown error, please contact the bot admin');
			}
		}
		else if(args[0] === 'remove') {
			await playlistDB.removePlaylist(message.guild.id, args[1], message.member.id, message);
			return;
		}
		const playlist = await playlistDB.getPlaylist(message.guild.id, args[0]);
		console.log(playlist);
		if(playlist === null) {
			return message.reply('The playlist you are looking for does not exist');
		}
		const playlistInfo = await Youtube.getPlaylist(playlist);
		const videos = await playlistInfo.getVideos();
		const playlistVideos = [];
		videos.forEach(element => {
			playlistVideos.push(element.url);
		});
		if(!message.guild.me.voice.connection) {
			message.client.queue.set(message.guild.id, [playlistVideos[0]]);
			for(i = 1; i < playlistVideos.length; i++) {
				message.client.queue.get(message.guild.id).push(playlistVideos[i]);
			}
			const connection = await message.member.voice.channel.join();
			play(message, connection);
			return;
		}
		if(message.guild.me.voice.connection) {
			for(i = 0; i < playlistVideos.length; i++) {
				message.client.queue.get(message.guild.id).push(playlistVideos[i]);
			}
			return message.channel.send('Songs added to queue');
		}
	},
};