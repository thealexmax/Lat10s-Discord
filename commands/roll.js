module.exports = {
	name: 'roll',
	description: 'Rolls a dice',
	execute(message, args) {
		if(!args[0]) {
			return message.channel.send(`You rolled a: ${Math.floor(Math.random()*6+1)}`);
		}
		let range = args[0].split("d");
		//Math.random() * (max - min) + min
		return message.channel.send(`You rolled a: ${Math.floor(Math.random()*(Math.floor(range[1])-Math.ceil(range[0])+1)+ Math.ceil(range[0]))}`);
	},
};