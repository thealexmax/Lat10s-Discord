const { play } = require('../includes/play');
module.exports = {
	name: 'skip',
	description: 'Skips to the next song',
	execute(message) {
		if(!message.guild.me.voice.connection) {
			return message.reply('I\'m not playing any music rigth now');
		}
		if(!message.member.voice.channel) {
			return message.reply('You\'re not in a voice channel right now');
		}
		if(message.member.voice.channelID != message.guild.me.voice.channelID) {
			return message.reply('We are not in the same voice channel');
		}
		const queue = message.client.queue.get(message.guild.id);
		queue.shift();
		if(!queue[0]) {
			message.client.loop.set(message.guild.id, false);
			console.log('queue[0] is null, leaving channel');
			message.reply('Queue is empty, leaving voice channel');
			message.guild.me.voice.channel.leave();
			return;
		}
		play(message, message.guild.me.voice.connection);
	},
};