module.exports = {
	name: 'loop',
	description: 'Loops song',
	execute(message) {
        let isLoop = message.client.loop.get(message.guild.id);
        if(!message.member.voice.channelID) {
            return message.reply("You need to be in a voice channel!");
        }
        if(!message.guild.me.voice.connection) {
            return message.reply("I'm not playing anything right now :/");
        }
        if(message.guild.me.voice.channelID != message.member.voice.channelID) {
            return message.reply("We're not in the same voice channel");
        }
        if(isLoop == false) {
            message.client.loop.set(message.guild.id, true);
            return message.channel.send(`Loop set to: ${message.client.loop.get(message.guild.id)}`);
        } else {
            message.client.loop.set(message.guild.id, false);
            return message.channel.send(`Loop set to: ${message.client.loop.get(message.guild.id)}`);
        }
	},
};