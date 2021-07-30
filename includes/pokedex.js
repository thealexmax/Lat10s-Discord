const https = require('https');

module.exports = {
	getPokemon(pokemon) {
		const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
		return new Promise((resolve) => {
			https.get(url, (resp) => {
				let data = '';
				resp.on('data', chunk => data += chunk);
				resp.on('end', () => {
					if(data != 'Not Found') resolve(JSON.parse(data));
					else resolve(null);
				});
			});
		});
	},
};