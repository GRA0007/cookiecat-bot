const fs = require('fs');
const Discord = require('discord.js');
const settings = require('./config.json');

const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity('with Steven! | Mention me');
});

client.on('guildCreate', guild => {
	console.log(`Joined ${guild.name} \\o/`);
	guild.systemChannel.send('Cookie Cat! <:cookiecat:357099473400233984> Mention me in a voice channel!\nSend `@CookieCat about` for info.');
});

client.on('message', async message => {
	if (message.author.bot) return;

	if (message.mentions.has(client.user)) {
		const args = message.content.trim().split(/ +/).filter(arg => !Discord.MessageMentions.USERS_PATTERN.test(arg));
		const command = args.shift().toLowerCase();

		if (command == 'help' || command == 'about') {
			let em = new Discord.MessageEmbed()
				.setColor('#fe9bbd')
				.setAuthor('CookieCat', 'https://cdn.discordapp.com/avatars/356796629950529538/7030a258fd1de95d46ac13af22b924b1.webp', 'https://gra0007.github.io/cookiecat-website/')
				.addField('Joined servers', client.guilds.cache.size, true)
				.addField('Invite link', 'https://bit.ly/cookiecatbot', true)
				.addField('Creator', 'Benpai#9772', true)
				.addField('Help', 'Mention @CookieCat to get the lyrics to the Cookie Cat song from Cartoon Network\'s Steven Universe. If you are in a voice channel, the music will also play.');
			message.channel.send(em);
		} else {
			// Send lyrics
			message.channel.send("Oohhhhh!\nHe's a frozen treat with an all new taste!\n'cause he came to this planet from outer space!\nA refugee of an interstellar war!\nBut now he's at your local grocery store!\nCookie Cat!\nHe's a pet for your tummy!\nCookie Cat!\nHe's super duper yummy!\nCookie Cat!\nHe left his family behind!\nCookie Caaaaat! <:cookiecat:357099473400233984>");

			// Join the same voice channel of the author of the message
			if (message.member.voice.channel) {
				const connection = await message.member.voice.channel.join();
				// Play track
				const dispatcher = connection.play(fs.createReadStream('song.ogg'), { type: 'ogg/opus' });

				dispatcher.on('start', () => {
					console.log(`Playing in ${message.guild.name}`);
				});

				dispatcher.on('finish', () => {
					connection.disconnect();
				});

				dispatcher.on('error', (e) => {
					console.log(e);
					connection.disconnect();
				});
			}
		}
	}
});

client.login(settings.token);
