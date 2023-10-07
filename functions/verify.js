import { log, warn } from "../services/console.js"
import { die } from "../controllers/phaser.js"
import { buildText } from "../services/translation/index.js";

async function verifyLanguage() {
    const array = process.argv.slice(2)
    const env = process.env

    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element === '--LANG' || element === '--lang') {
            env.LANG = array[index + 1]
        }
    }

    const language = env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES
    let flip = false

    const accepted = ['pt_BR.UTF-8', 'en_US.UTF-8']
    if (accepted.join(';').includes(language + ';')) {
        flip = true
        process.env.LANG = language    
    }

    if (flip)
        return

    log('Language not supported, for more details see: \nhttps://github.com/PedroThiagoMaisse/CommitMapping', 'red')
    warn('It will be run in english\n')

    process.env.Lang = 'en_US.UTF-8'
    return
}
 

function verifyToken() {
    if (process.env.TOKEN === 'none') {
        warn(buildText('no_token', process.env.COMMITPATH))
    }

    return
}

export {verifyLanguage, verifyToken}