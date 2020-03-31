//The environment string loads the corresponding .env file from the config folder.
//It controls the output channel and log file.
//Current options are 'production' or 'test'
environment = 'production'

require('./consoleTimestamp')()
const {resolve} = require('path')
path = require('path')
env = require('dotenv').config({path: resolve(__dirname,`./config/${environment}.env`)}).parsed
const fs = require('fs')
const request = require('request');

const config = require("./config/botconfig.json")
image_folder = resolve(__dirname,'./assets/') + path.sep
const Discord = require("discord.js")
const client = new Discord.Client({disableEveryone: true})
var image = 0


client.on("ready", async message => {
	console.log("Started");
	client.user.setActivity("Playing jubeat");
});


client.on("message", async message => {
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) === 0 || message.content.indexOf(config.dotprefix) === 0) {} else {return}
	const args = message.content.slice(1).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

    if(command === "daily"){
        imagelog = fs.readFileSync(env.logfile).toString('utf-8')
        image_array = imagelog.replace(/\r\n|\n/g, ',').split(",").filter(Boolean)
        image = image_array.shift()
        await message.reply({
                    files: [image_folder+image+".png"]
                    }).catch(error => console.log(`Couldn't post because of: ${error}`))
    }

    if(command === "e"){
        emoji_id = null
        url = null

        if(!args[0]){return message.reply('\nUse the .e command + any animated or custom emoji, with a space in between.\nRegular emoji are not supported, sowwy.')}
        cmdparse = args[0].split(/[:<>]/).filter(Boolean)
        if(cmdparse[0] === 'a'){
            emoji_id = cmdparse[2]
            url = `https://cdn.discordapp.com/emojis/${emoji_id}.gif`
        } else if (Number.isInteger(parseInt(cmdparse[1]))){
            emoji_id = cmdparse[1]
            url = `https://cdn.discordapp.com/emojis/${emoji_id}.png`
        } else {
            return message.reply("Sorry, you can't use regular emojis.")

        }
        console.log(`posting emoji ${emoji_id}`)
        imagebuffer = request({ url, encoding: null }, (err, resp, buffer) => {
            return buffer
        });
        channelid = message.channel.id
        message.channel.messages.fetch(message.id).then(async msg => {
            await message.reply({
                        files: [imagebuffer]
                    }).catch(error => console.log(`Couldn't post emoji because of: ${error}`))
              if (msg) msg.delete();
        });
    }

});

client.login(config.token);
