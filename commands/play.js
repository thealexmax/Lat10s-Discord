const { play } = require('../includes/play');
const config = require('../config.json');
const ytapi = require('simple-youtube-api');
const Youtube = new ytapi(config.ytapi);
module.exports = {
	name: 'play',
	description: 'Plays Music',
	async execute(message, args) {
		// const musicQueue = message.client.queue.get(message.guild.id);
		if(!args[0]) {
			return message.reply('Please, enter a song title/URL');
		}
		if(!message.member.voice.channelID) {
			return message.reply('You are not in a voice channel');
		}
		// eslint-disable-next-line no-useless-escape
		const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
		const playlistVideos = [];
		if(!args[0].match(regExp) && !args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/g)) {
			message.channel.send('No Youtube URL detected, searching by title...');
			const videos = await Youtube.searchVideos(args.join(' '), 4);
			args[0] = videos[0].url;
		}
		if(args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/g)) {
			const playlist = await Youtube.getPlaylist(args[0]);
			const videos = await playlist.getVideos();
			console.log(videos[0].url);
			videos.forEach(element => {
				playlistVideos.push(element.url);
			});
		}
		if(!message.guild.me.voice.connection) {
			if(!playlistVideos[0]) {
				message.client.queue.set(message.guild.id, [args[0]]);
				message.client.loop.set(message.guild.id, false);
			}
			else {
				message.client.queue.set(message.guild.id, [playlistVideos[0]]);
				message.client.loop.set(message.guild.id, false);
				// eslint-disable-next-line no-undef
				for(i = 1; i < playlistVideos.length; i++) {
					// eslint-disable-next-line no-undef
					message.client.queue.get(message.guild.id).push(playlistVideos[i]);
				}
			}
			const connection = await message.member.voice.channel.join();
			play(message, connection);
			return;
		}
		if(message.guild.me.voice.connection) {
			if(message.guild.me.voice.channelID != message.member.voice.channelID) {
				return message.reply('Sorry, but we have to be on the same VC');
			}
			if(args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/g)) {
				for(i = 0; i < playlistVideos.length; i++) {
					message.client.queue.get(message.guild.id).push(playlistVideos[i]);
				}
				return message.reply('Playlist added to the current queue');
			} 
			else {
				message.client.queue.get(message.guild.id).push(args[0]);
				return message.channel.send('Song added to queue');
			}
		}
	},
};