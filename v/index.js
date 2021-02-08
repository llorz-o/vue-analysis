import path from 'path'
import {readFile, writeFile} from 'fs'
import {buildMap} from './parse'

const htmlPath = path.resolve(__dirname, "./assets/t1.html")
const writePath = path.resolve(__dirname, "../out.json")

readFile(htmlPath, (err, data) => {
    if (err) return console.error(err)
    const outs = buildMap(data.toString().replace(/\r\n[ ]*/igm, ""));
    writeFile(writePath, JSON.stringify(outs), {flag: "w"}, (err) => {
        if (err) return console.error(err)
    })
})
//121212