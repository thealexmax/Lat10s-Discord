const ytdl = require('ytdl-core-discord');
module.exports = {
	async play(message, connection) {
		let queue = message.client.queue.get(message.guild.id);
		const info = await ytdl.getInfo(queue[0]);
		message.channel.send(`Playing: ${info.videoDetails.title}`);
		const dispatcher = connection.play(await ytdl(queue[0], { filter: 'audioonly', highWaterMark: 1 << 25 }), { type: 'opus' });
		dispatcher.on('finish', () => {
			console.log('Finished Playing');
			queue.shift();
			if(queue[0]) {
				module.exports.play(message, connection);
			}
			else {
				// Remove this line if you want the queue to persist after the bot has left the voice channel
				queue = [];
				message.guild.me.voice.connection.channel.leave();
				return;
			}
		});
	},
};