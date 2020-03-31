environment = 'test'

const {resolve} = require('path')
path = require('path')
env = require('dotenv').config({path: resolve(__dirname,`./config/${environment}.env`)}).parsed
const fs = require('fs')

// This was our original RNG function.
var graficalog = fs.readFileSync(env.logfile).toString('utf-8')
var grafica_array = graficalog.replace(/\r\n|\n/g, ',').split(",").filter(Boolean)

var i = 0  // we use a do: while loop and increment a counter so the loop ends after 205 tries.
do {
grafica = Math.floor((Math.random() * 36)+1).toString()
i++
}
while(grafica_array.includes(grafica) && i < grafica_array.length)
if(!grafica_array.includes(grafica)) {
    fs.appendFileSync(env.logfile, "\r\n"+grafica, (err) => {
        if(err) throw err
    })
}