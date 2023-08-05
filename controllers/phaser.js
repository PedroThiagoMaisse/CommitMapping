import { ask, createFile} from "./inOut.controller.js"
import { err, log, spinner, warn } from "../services/log.js"
import { setEnvironmentVariable } from "../services/Envs.js"
import { ErrorLog } from "../services/errorHandler.js"
import { execute, deleteFolder } from "../services/promisses.js"

let finish = true

async function exitHandler(options, exitCode) {
    if (finish) {
        console.log('FORCED CLOSING \n\n' + exitCode)
        await execute(`date ${u[0]}-${u[1]}-${u[2]}`)
    }
    finish = false
    process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

let u = []

async function die() {
    warn('Finalizando processo')
    spinner.End()
    await ErrorLog.createLog()
    await deleteFolder(process.env.commitpath + '/temp', { recursive: true, force: true })

    await execute(`date ${u[0]}-${u[1]}-${u[2]}`)
    finish = false
    process.exit()
}

async function born() {
    const s = await execute('date /t')
    u = s.stdout.split('/')
    
    console.clear()
    log('\n/----  Iniciando o fluxo ----/\n', ['inverse'])

    const obj = {}

    obj.author = process.env.author? process.env.author : await ask('Qual o inicio do email (antes do @)?', '')
    obj.project = process.env.project? process.env.project : await ask('Qual a url do projeto aonde será realizado os commits?', '')
    obj.token = process.env.token? process.env.token : await ask('Um token com acesso ao repositório, para gerar um vá à: https://github.com/settings/tokens', '', true)

    const check = { commitpath: '/commitMapping', lookatpath: '/Users', isTest: false }

    for (const [key, value] of Object.entries(check)) {
        if(!process.env[key]) {obj[key] = value} 
    }

    await setEnvironmentVariable(obj)

    if (obj.token === 'none') {
        warn(`\nA falta do tokens pode gerar problemas no push, caso isso ocorra vá a rota ${process.env.commitpath}/project e faça o push manualmente`)
    }

    return true

}

export {die, born}