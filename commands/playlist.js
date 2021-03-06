const playlistDB = require('../includes/playlistManager');
const { play } = require('../includes/play');
const config = require('../config.json');
const ytapi = require('simple-youtube-api');
const playlistManager = require('../includes/playlistManager');
const Youtube = new ytapi(config.ytapi);
const Sequelize = require('sequelize');

function shuffleArray(array) {
	let currentIndex = array.length, randomIndex;
	//Shuffle elements of the array while there are elements remaining
	while(currentIndex != 0) {
		//Pick an element
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		//Swap elements
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
}

module.exports = {
	name: 'playlist',
	description: 'Saves/Plays a playlist',
	async execute(message, args) {
		const sequelize = new Sequelize('database', 'username', 'password', {
			host: 'localhost',
			dialect: 'sqlite',
			logging: false,
			storage: `./db/${message.guild.id}.sqlite`,
		});
		const Playlists = sequelize.define('playlists', {
			name: {
				type: Sequelize.STRING,
				unique: true,
			},
			url: Sequelize.TEXT,
			username: Sequelize.STRING,
			usage_count: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
		});
		switch (args[0]) {
			case 'add':
				if(args[1] === 'Random') {
					return message.reply('You canot name a playlist "Random"');
				}
				if(!args[2]) {
					return message.reply('You need to provide a Youtube URL');
				}
				if(!args[2].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/g)) {
					return message.reply('I need you to provide me with a youtube playlist URL');
				}
				const playlist = await playlistDB.createPlaylist(Playlists, message.member.id, args[1], args[2]);
				if(playlist === 0) {
					return message.reply('Playlist added');
				}
				else if(playlist === 1) {
					return message.reply('That playlist already exists');
				}
				else if(playlist === 2) {
					return message.reply('Unknown error, please contact the bot admin');
				}
				return;
			case 'remove':
				let playlistCreator = await playlistDB.getPlaylist(Playlists, args[1]);
				if(playlistCreator != message.member.id) {
					return message.reply('Esa playlist no es de tu propiedad :/');
				}
				await playlistDB.removePlaylist(Playlists, args[1], message.member.id, message);
				return;
			case 'list':
				const topPlaylists = await playlistDB.topPlaylist(Playlists);
				message.channel.send('These are the most popular playlists (Ordered by play count): ');
				for(i = 0; i < 10; i++) {
					if(!topPlaylists[i]) {
						break;
					}
					message.channel.send(`${i+1}. ${topPlaylists[i].dataValues.name} [Played: ${topPlaylists[i].dataValues.usage_count} times]`);
				}
				return;
			case 'Random':
				const tmpPlaylists = await playlistDB.topPlaylist(Playlists);
				args[0] = tmpPlaylists[Math.floor(Math.random()*tmpPlaylists.length)].dataValues.name;
				break;
			default:
				break;
		}
		/*
		else if(args[0] === '') 
		*/
		if(!message.member.voice.channelID) {
			return message.reply('You are not in a voice channel');
		}
		const playlist = await playlistDB.getPlaylist(Playlists, args[0]);
		if(playlist === null) {
			return message.reply('The playlist you are looking for does not exist');
		}
		const playlistInfo = await Youtube.getPlaylist(playlist.dataValues.url);
		const videos = await playlistInfo.getVideos();
		let playlistVideos = [];
		videos.forEach(element => {
			playlistVideos.push(element.url);
		});
		if(args[1]) {
			if(args[1].toLowerCase() === "shuffle") {
				//Shuffle playlistVideos
				playlistVideos = shuffleArray(playlistVideos);
			}
		}
		await playlistManager.editUsageCount(Playlists, playlist.dataValues.id, playlist.dataValues.usage_count);
		if(!message.guild.me.voice.connection) {
			message.client.queue.set(message.guild.id, [playlistVideos[0]]);
			message.client.loop.set(message.guild.id, false);
			for(i = 1; i < playlistVideos.length; i++) {
				message.client.queue.get(message.guild.id).push(playlistVideos[i]);
			}
			const connection = await message.member.voice.channel.join();
			play(message, connection);
			return;
		}
		if(message.guild.me.voice.connection) {
			if(message.guild.me.voice.channelID != message.member.voice.channelID) {
				return message.reply('We are not in the same voice channel');
			}
			for(i = 0; i < playlistVideos.length; i++) {
				message.client.queue.get(message.guild.id).push(playlistVideos[i]);
			}
			return message.channel.send('Songs added to queue');
		}
	},
};
