module.exports = {
	async createPlaylist(Playlists, userID, playlistName, playlistURL) {
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
	async getPlaylist(Playlists, playlistName) {
		await Playlists.sync();
		const playlist = await Playlists.findOne({ where: { name: playlistName } });
		if(playlist === null) {
			return null;
		}
		return playlist;
	},
	async removePlaylist(Playlists, playlistName, userID, message) {
		await Playlists.sync();
		const playlist = await Playlists.findOne({ where: { name: playlistName } });
		if(playlist === null) {
			return message.reply('Playlist does not exist');
		}
		if(playlist.dataValues.username != userID) return message.reply('You are not the owner of the playlist');
		await Playlists.destroy({ where: { name: playlistName } });
		return message.reply('Playlist removed');
	},
	async editUsageCount(Playlists, playlistID, pastusagecount) {
		await Playlists.sync();
		await Playlists.update({ usage_count: pastusagecount+1 }, { where: { id: playlistID } });
	},
	async topPlaylist(Playlists) {
		await Playlists.sync();
		const result = await Playlists.findAll({ order: [['usage_count', 'DESC']] });
		return result;
	}
};
