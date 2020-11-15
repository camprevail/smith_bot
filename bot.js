//The environment string loads the corresponding .env file from the config folder.
//It controls the output channel and log file.
//Current options are 'production' or 'test'
environment = 'production'

require('./consoleTimestamp')()
const {resolve} = require('path')
path = require('path')
env = require('dotenv').config({path: resolve(__dirname,`./config/${environment}.env`)}).parsed
const fs = require('fs')
const bent = require('bent')
const getBuffer = bent('buffer')
const Twitter = require('node-tweet-stream')
_ = require('lodash')

const isTweet = _.conforms({
  id_str: _.isString,
  text: _.isString,
  in_reply_to_status_id: _.isNull
})

const config = require("./config/botconfig.json")
const emblem_name = require("./assets/emblem-names.json")
image_folder = resolve(__dirname,'./assets/tips/') + path.sep
emblem_folder = resolve(__dirname,'./assets/emblem-compiled/') + path.sep
const Discord = require("discord.js")
const client = new Discord.Client({ disableMentions: 'everyone' })
var image = 0

var stream = new Twitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
//  bearer_token: ''
  token: config.access_token_key,
  token_secret: config.access_token_secret
});

stream.follow(171715340) //jubeat_staff
stream.on('tweet', function(data) {
  if (isTweet(data) && data.user.id == 171715340) {
    post(data.user.id_str, data.id_str)
  }
});
stream.on('error', function(error) {
  console.log(error);
});

async function post(userid, postid) {
    await client.channels.cache.get(env.output_channel).send(`twitter@jubeat_staff https://twitter.com/${userid}/statuses/${postid}`).catch(error => console.log(`error at line 48: ${error}`))
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on("ready", async message => {
	console.log("Started");
	client.user.setActivity("jubeat");
});


client.on("message", async message => {
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) === 0 || message.content.indexOf(config.dotprefix) === 0) {} else {return}
	const args = message.content.slice(1).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

    if(command === "daily"){
        imagelog = fs.readFileSync(env.daily_log).toString('utf-8')
        image_array = imagelog.replace(/\r\n|\n/g, ',').split(",").filter(Boolean)
        image = image_array.shift()
        await message.reply("Here's today's jubeat news.", {
                    files: [image_folder+image+".png"]
                    }).catch(error => console.log(`Couldn't post image because of: ${error}`))
    }

    if(command === "emblem"){
        emblemlog = fs.readFileSync(env.emblem_daily).toString('utf-8')
        emblem_array = emblemlog.replace(/\r\n|\n/g, ',').split(",").filter(Boolean)
        emblem = emblem_array.shift()
        await message.reply(`Here's today's SP emblem.\nTitle: ${emblem_name[emblem]}`, {
                    files: [emblem_folder+emblem+".png"]
                    }).catch(error => console.log(`Couldn't post emblem because of: ${error}`))
    }

    if(command === "e"){
        emoji_id = null
        url = null

        if(!args[0]){return message.reply('\nUse the .e command + any animated or custom emoji, with a space in between.\nRegular emoji are not supported, sowwy.')}
        cmdparse = args[0].split(/[:<>]/).filter(Boolean)
        if(cmdparse[0] === 'a'){
            emoji_id = cmdparse[2]
            emoji_ext = '.gif'
            url = `https://cdn.discordapp.com/emojis/${emoji_id}.gif`
        } else if (Number.isInteger(parseInt(cmdparse[1]))){
            emoji_id = cmdparse[1]
            emoji_ext = '.png'
            url = `https://cdn.discordapp.com/emojis/${emoji_id}.png`
        } else {
            return message.reply("Sorry, you can't use regular emojis.")

        }
        console.log(`posting emoji ${emoji_id}`)
        imagebuffer = await getBuffer(url)
        channelid = message.channel.id
        message.channel.messages.fetch(message.id).then(async msg => {
            await message.reply("", {
                        files: [{attachment: imagebuffer, name: `${emoji_id}${emoji_ext}`}]
                    }).catch(error => console.log(`Couldn't post emoji because of: ${error}`))
              if (msg) msg.delete();
        });
    }

});

client.on("message", async message => {
	if(message.author.bot) return;
	reactions = ['700402109140434945', '486747094653075476', '675424129712652318', '669294560312164353', '690274811183628350', '291855959381245952']
	reaction = reactions[Math.floor(Math.random() * reactions.length)]
	if (message.mentions.has(client.user)) {
        message.react(reaction)
	}
});

client.on("message", async message => {
	if(message.author.bot) return;
    if(message.content.indexOf(config.prefix) === 0 || message.content.indexOf(config.dotprefix) === 0) {} else {return}
    const args = message.content.slice(1).trim().split(/ +/g)
    regex = RegExp(/!|#|:|```|\[|\{|\(|\)|\}|\]|\\r|\\n|\+|\?|\$|\^|[\u200B-\u200D\uFEFF]/g)
    try {
        if ( args.length == 5 && args[0].startsWith('<') && args[1].length > 4 && args[1].slice(0, 2) != '<@' && args[1].length < 32 && regex.test(args[1]) == false && args[args.length - 3].toLowerCase() == 'summoning' && args[args.length - 2].toLowerCase() == 'ritual') {
            await client.channels.cache.get(message.channel.id).send(message.content.slice(1)).catch(error => console.log(`error at line 130: ${error}`))
        } else if (args[1].slice(0, 2) == '<@') {
            await message.reply('Mentions are not available for this version of the command.\nPlease see the pinned message in <#291802168372101120> for usage.').catch(error => console.log(`error at line 132: ${error}`))
        }
    } catch(err){
        console.log(`error at line 135: ${err} from message: ${message.content}`)
    }
});

client.on("message", async message => {
	if(message.author.bot) return;
    const args = message.content.trim().split(/ +/g);
    var username
    if (args.length == 1 && args[0].startsWith('<@')) {
        try {
            username = getUserFromMention(args[0])
        } catch(err) {
//            console.log(`error at line 117: ${err}`)
        }
        if (username) {
            await client.channels.cache.get(message.channel.id).send(`<:smithhandsrev:675424129712652318> ${username} summoning ritual <:smithhands:669294560312164353>`).catch(error => console.log(`error at line 150: ${error}`))
            username = null
        }
    }
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
	// If the role(s) are present on the old member object but no longer on the new one (i.e role(s) were removed)
	const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
	if (addedRoles.map(r => r.name) == 'Confirmed') {
	    await client.channels.cache.get(env.output_channel).send(`Welcome <@${oldMember.id}> <:smithowo:700402109140434945> Post food.\nAlso, please review the server rules here: https://discord.com/channels/291800868171284480/296071002842988554/547872219770912815`)
	}

});

function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}
		try {
		    username = client.users.cache.get(mention).username
		} catch(err) {
		    console.log(`error at line 177: ${err} from mention: ${mention}`)
		}
		return username
	}
}

client.login(config.token);
