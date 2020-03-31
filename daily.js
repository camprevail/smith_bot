//The environment string loads the corresponding .env file from the config folder.
//It controls the output channel and log file.
//Current options are 'production' or 'test'
environment = 'production'

require('./consoleTimestamp')()
const {resolve} = require('path')
path = require('path')
env = require('dotenv').config({path: resolve(__dirname,`./config/${environment}.env`)}).parsed
console.log(env.logfile)

const config = require("./config/botconfig.json")
image_folder = resolve(__dirname,'./assets/') + path.sep
const Discord = require("discord.js")
const client = new Discord.Client({disableEveryone: true})
var image = 0


const channel_general = '291802168372101120'
const channel_cammy_server = '673516599851876384'


client.on("ready", async ready => {
        console.log("ready")
        //client.channels.cache.get(channel_general).send("YES UwU")
        loggedImages()
        setTimeout(function(){ // Logout and quit after 20s
            client.destroy()
        }, 20000)

})


//logs values recorded
async function loggedImages() {
    try {
        image = await getValue()

        if (image) {
            await post_image(image)
        }
    } catch(err) {
        console.log(err)
    }
}

function getValue(){
	fs = require('fs')
	imagelog = fs.readFileSync(env.logfile).toString('utf-8')
	defaults_log = fs.readFileSync(env.defaults_log).toString('utf-8')
    image_array = imagelog.replace(/\r\n|\n/g, ',').split(",").filter(Boolean)
    defaults_array = defaults_log.replace(/\r\n|\n/g, ',').split(",").filter(Boolean)
    image = image_array.shift()
    if (image) {
            fs.writeFile(env.logfile, image_array.map(item => item + '\r\n').join().replace(/,/g, ''), (err) => {
                if(err) throw err
            })
    } else {
        image = defaults_array.shift()
        fs.writeFile(env.logfile, defaults_array.map(item => item + '\r\n').join().replace(/,/g, ''), (err) => {
                        if(err) throw err
                    })
        const warn_reset = "Smith image log was reset."
        if (environment === 'production') {
            client.channels.cache.get(channel_cammy_server).send(warn_reset)
        }
        console.log(`image = ${image}`)
        console.log(warn_reset)
        return image
    }
	return image
}

async function post_image(image) {
	if (image) { // if image is not 'undefined', which happens if you run out of images
        console.log(`Posting: ${image}`)
        await client.channels.cache.get(env.output_channel).send({
            files: [image_folder+image+".png"]
            }).catch(error => console.log(`Couldn't post because of: ${error}`))
    } else {
        console.log(`Not attempting to post image: ${image}`)
    }
}

client.login(config.token)
