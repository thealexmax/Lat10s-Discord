const pokedex = require('../includes/pokedex');
const Discord = require('discord.js');
module.exports = {
	name: 'pokedex',
	description: 'Pokedex command!',
	async execute(message, args) {
		args = args.join('-').toLowerCase();
		if(!args[0]) {
			return message.channel.send('No pokemon detected');
		}
		if(args === 'random') {
			args = Math.floor((Math.random() * 898) + 1);
		}
		const pokeData = await pokedex.getPokemon(args);
		if(!pokeData) {
			return message.reply('Pokemon not found!');
		}
		let sprite = pokeData.sprites['front_default'];
		if(pokeData.sprites['versions']['generation-v']['black-white'].animated['front_default']) {
			sprite = pokeData.sprites['versions']['generation-v']['black-white'].animated['front_default'];
		}
		let type = [];
		pokeData.types.forEach(element => {
			type.push(element.type.name);
		});
		type = type.join('/');
		const pokedexEmbed = new Discord.MessageEmbed()
			.setColor('#1d53bf')
			.setTitle('Lat10s Pokedex')
			.setThumbnail(sprite)
			.addFields(
				{ name: 'Name:', value: pokeData.name, inline: true },
				{ name: 'No:', value: pokeData.id, inline: true },
				{ name: 'Types: ', value: type, inline: true },
				{ name: 'Height: ', value: pokeData.height / 10 + 'm', inline: true },
				{ name: 'Weight: ', value:  pokeData.weight / 10 + 'kg', inline: true },
			);
		message.channel.send(pokedexEmbed);
	},
};