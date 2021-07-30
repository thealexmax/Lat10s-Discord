module.exports = {
	name: 'stop',
	description: 'Stops Music Player',
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
		// Remove this if you want queue to persist
		let queue = message.client.queue.get(message.guild.id);
		// eslint-disable-next-line no-unused-vars
		queue = [];
		message.guild.me.voice.channel.leave();
	},
};