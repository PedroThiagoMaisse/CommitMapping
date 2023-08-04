import { ask, createFile} from "./inOut.controller.js"
import { log, spinner, warn } from "../services/log.js"
import { setEnvironmentVariable } from "../services/Envs.js"
import { promisify } from 'util'
import fs from 'fs'
const deleteFolder = promisify(fs.rm)
import { exec } from 'child_process'
const execute = promisify(exec)

let u = []

async function die() {
    warn('Finalizando processo')
    spinner.End()
    await deleteFolder(process.env.commitpath + '/temp', { recursive: true, force: true })

    await execute(`date ${u[0]}-${u[1]}-${u[2]}`)
    process.kill(0)
}

async function born() {
    const s = await execute('date /t')
    u = s.stdout.split('/')
    
    log('Iniciando o fluxo', ['inverse', 'green'])

    const obj = {}

    obj.author = process.env.author? process.env.author : await ask('Qual o inicio do email (antes do @)?', 'pedro.thiago')
    obj.project = process.env.project? process.env.project : await ask('Qual a url do projeto aonde será realizado os commits?', '')
    obj.token = process.env.token? process.env.token : await ask('Um token com acesso ao repositório, para gerar um vá à: https://github.com/settings/tokens', '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', true)

    const check = { commitpath: '/commitMapping', lookatpath: '/Users', isTest: false }

    for (const [key, value] of Object.entries(check)) {
        if(!process.env[key]) {obj[key] = value} 
    }

    await setEnvironmentVariable(obj)

    if (obj.token === 'none') {
        warn(`\nA falta do tokens pode gerar problemas no push, caso isso ocorra vá a rota ${process.env.commitpath}/project e faça o push manualmente`)
    }
    
    createFile(process.env.commitpath + '/log.txt', JSON.stringify(u))
    return true

}

export {die, born}