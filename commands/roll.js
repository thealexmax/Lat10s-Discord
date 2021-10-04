module.exports = {
	name: 'roll',
	description: 'Rolls a dice',
	execute(message, args) {
		if(!args[0]) {
			return message.channel.send(`You rolled a: ${Math.floor(Math.random()*6+1)}`);
		}
		let diceNumber = args[0].split("d");
		const diceList = [];
		let result = Math.floor(Math.random()*diceNumber[1]+1);
		diceList.push(result);
		for(i = 1; i < diceNumber[0]; i++) {
			let dice = Math.floor(Math.random()*diceNumber[1]+1);
			result += dice;
			diceList.push(dice);
		}
		if(!args[1]) {
			return message.channel.send(`Rolled: [${diceList}], Result: ${result}`);
		}
		for(i = 1; i < args.length; i++) {
			//Thanks stackoverflow, very cool!
			let num = args[i].match(/\d+/g);
			if(!num) {
				num = diceNumber[1];
			}
			let letr =  args[i].match(/[a-zA-Z]+/g);
			let exploded = [];
			switch (letr[0]) {
				case "e":
					exploded = [];
					diceList.forEach(element => {
						if(element == num) {
							let dice = Math.floor(Math.random()*diceNumber[1]+1);
							result += dice;
							exploded.push(dice);
						}
					});
					console.log(diceList);
					console.log(exploded);
					return message.channel.send(`Rolled: [${diceList}], Exploded: [${exploded}], Result: ${result}`);
				case "ie":
					exploded = [];
					diceList.forEach(element => {
						if(element == num) {
							let dice = Math.floor(Math.random()*diceNumber[1]+1);
							result += dice;
							exploded.push(dice);
						}
					});
					exploded.forEach(element => {
						if(element == num) {
							let dice = Math.floor(Math.random()*diceNumber[1]+1);
							result += dice;
							exploded.push(dice);
						} 
					});
					console.log(diceList);
					console.log(exploded);
					return message.channel.send(`Rolled: [${diceList}], Exploded: [${exploded}], Result: ${result}`);
				default:
					return message.channel.send("Unknown command");
			}
		}
	},
};
