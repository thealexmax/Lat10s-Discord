module.exports = {
	name: 'roll',
	description: 'Rolls a dice',
	execute(message) {
        message.channel.send(`You rolled a: ${Math.floor(Math.random()*6+1)}`);
	},
};