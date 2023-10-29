import { createFile } from '../services/fs.js'
import { die } from "../controllers/phaser.js"
import { err } from "../utils/console.js"
const sep = `/-----------------------------------------------------/`

async function errorHandler(error) { 
    err(error)

    return die()
}

const ErrorLog = {
    log: '',

    addNewLog: async function (err) {
        this.log += `\n\n${sep}\n\n${err}`
    },

    addRawLog: async function (err) {
        this.log += err
    },

    createLog: async function () {
        if (this.log !== '') await createFile(process.env.COMMITPATH + '/errors.txt', this.log)
        return
    }

}


export {errorHandler, ErrorLog}