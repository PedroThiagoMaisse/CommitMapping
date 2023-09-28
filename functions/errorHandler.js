import { createFile } from '../services/outputs/fs.js'
import { die } from "../controllers/phaser/index.js"
import { err } from "../services/outputs/log.js"
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