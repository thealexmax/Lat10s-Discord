const Sequelize = require('sequelize');

module.exports = {
	async createPlaylist(serverID, userID, playlistName, playlistURL) {
		const sequelize = new Sequelize('database', 'username', 'password', {
			host: 'localhost',
			dialect: 'sqlite',
			logging: false,
			storage: `./db/${serverID}.sqlite`,
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
		await Playlists.sync();
		try {
			const playlist = await Playlists.create({
				name: playlistName,
				url: playlistURL,
				username: userID,
			});
			console.log('Done');
			return 0;
		}
		catch(e) {
			if(e.name === 'SequelizeUniqueConstraintError') {
				return 1;
			} 
			else {
				console.error(e);
				return 2;
			}
		}
	},
	async getPlaylist(serverID, playlistName) {
		const sequelize = new Sequelize('database', 'username', 'password', {
			host: 'localhost',
			dialect: 'sqlite',
			logging: false,
			storage: `./db/${serverID}.sqlite`,
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
		await Playlists.sync();
		const playlist = await Playlists.findOne({ where: { name: playlistName } });
		if(playlist === null) {
			return null;
		}
		return playlist.dataValues.url;
	},
	async removePlaylist(serverID, playlistName, userID, message) {
		const sequelize = new Sequelize('database', 'username', 'password', {
			host: 'localhost',
			dialect: 'sqlite',
			logging: false,
			storage: `./db/${serverID}.sqlite`,
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
		await Playlists.sync();
		const playlist = await Playlists.findOne({ where: { name: playlistName } });
		if(playlist === null) {
			return message.reply('Playlist does not exist');
		}
		if(playlist.dataValues.username != userID) return message.reply('You are not the owner of the playlist');
		const playlistRem = await Playlists.destroy({ where: { name: playlistName } });
		return message.reply('Playlist removed');
	}
};