import { log, warn } from "../services/console.js"
import { die } from "../controllers/phaser.js"
import { buildText } from "../services/translation.js";

async function verifyLanguage() {
    const env = process.env;
    const language = env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES;
    let flip = false

    const accepted = ['pt_BR.UTF-8', 'en_US.UTF-']
    if (accepted.join(';').includes(language)) {
        flip = true
        process.env.LANG = language    
    }

    if (flip)
        return

    log('\n\nLanguage not supported, for more details see: \nhttps://github.com/PedroThiagoMaisse/CommitMapping\n\n', 'red')
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