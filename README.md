# Lat10s Discord Bot
> Music Bot made using discord.js & Discordjs.guide command handler.
## Requirements
1. Discord Bot Token
2. Youtube Data API v3 Token
3. Nodejs v14 or newer
## Installation

    git clone https://github.com/thealexmax/Lat10s-Discord.git
    npm install
 After installing everything you should be able to use `node server.js` to start the bot
 ## Configuration
 Open the config.json file and copy your API Keys inside it.
 
 ⚠️ DO NOT SHARE TOKENS/API KEYS WITH ANYONE
 Sample config.json:
 

    {
	    "token": "DISCORD_TOKEN",
	    "ytapi": "YOUTUBE_TOKEN",
	    "prefix": "."
	}

 ## Commands
 Play music: `.play <URL/Title/Youtube Playlist>`
 
 The bot will automatically add all songs inside a youtube playlist
 
 Save a playlist for later use: `.playlist add <Playlist Name>`
 
 Play a saved Playlist: `.playlist <Playlist Name>`
 
 Note: Playlists are not shared between servers
 
 Skip to the next song: `.skip`
 
 Stop playing music: `.stop`
 
 Search a pokemon in the Pokedex: `.pokedex <Pokemon Name/Random>`
 
