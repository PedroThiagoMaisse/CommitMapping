import { log, warn } from "../../services/outputs/log.js"
import { die } from "./index.js"

async function verifyOS() {
    const accepted = ['win32']
    if (accepted.join(';').includes(process.platform) || process.env.force) {
        return
    }
    log('\n\nSistema operacional não testado, para mais detalhes veja: \nhttps://github.com/PedroThiagoMaisse/CommitMapping\n\n', 'red')
    warn('é possível forçar o programa usando --force porém pode gerar problemas na organização dos arquivos\n')
    return die()
}

async function verifyLanguage() {
    const env = process.env;
    const language = env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES;

    const accepted = ['pt_BR.UTF-8']
    if (accepted.join(';').includes(language) || process.env.force) {
        return
    }
    log('\n\nLinguagem não suportada, para mais detalhes veja: \nhttps://github.com/PedroThiagoMaisse/CommitMapping\n\n', 'red')
    warn('é possível forçar o programa usando --force porém pode gerar problemas na organização dos arquivos\n')
    return die()
}
 

function verifyToken() {
    if (process.env.TOKEN === 'none') {
        warn(`\nA falta do tokens pode gerar problemas no push, caso isso ocorra vá a rota ${process.env.COMMITPATH}\\project e faça o push manualmente`)
    }

    return
}

export {verifyLanguage, verifyOS, verifyToken}