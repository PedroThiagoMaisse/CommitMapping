import { setCorrectTime, sleep } from "../services/utils.js"
import { ask, createFile } from "./inOut.controller.js"
import { err, log, spinner, warn } from "../services/log.js"
import { setEnvironmentVariable } from "../services/Envs.js"
import { ErrorLog } from "../services/errorHandler.js"
import { execute, deleteFolder } from "../services/promisses.js"
import { parse } from "../services/parser.js"
import chalk from "chalk"

let isOn = false


async function exitHandler(options, exitCode) {
    isOn = false
    spinner.End()
    await setCorrectTime()
    await ErrorLog.addNewLog('\n\nFORCED EXIT: ' + exitCode + '\n\n' + JSON.stringify(options))
    await ErrorLog.createLog()
    // console.clear()
    console.log(chalk.red('\n\nFORCED EXIT!\nSalvando detalhes em: ' + process.env.COMMITPATH + '/errors.txt'))
    process.exit();
}

process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

let startingDate = []
let mainPath = ''

async function die() {
    warn('Finalizando processo')
    await setCorrectTime()
    isOn = false
    spinner.End()
    await ErrorLog.createLog()
    await deleteFolder(process.env.COMMITPATH + '/temp', { recursive: true, force: true })

    await setCorrectTime()
    process.exit()
}

async function born() {
    isOn = true
    await setConsole()
    await gettingEnvInfo()
    await writingVarsToEnv()

    return true

}

async function setConsole() {
    console.clear()
    log('\n/----  Iniciando o fluxo ----/\n', ['inverse'])

     return true
}

async function gettingEnvInfo() {
    const s = await execute('date /t')
    startingDate = s.stdout

    mainPath = (await execute('cd')).stdout.split(':')[0] + ':'
}

async function writingVarsToEnv() {
    const obj = {}

    const options = parse(process.argv.slice(2))
    for (const [key, value] of Object.entries(options)) { options[key.toUpperCase()] = value }
    await setEnvironmentVariable(options)

    obj.startingDate = (await execute('date /t')).stdout.split('/')
    obj.AUTHOR = process.env.AUTHOR || await ask('Qual o inicio do email (antes do @)?', '')
    obj.PROJECTURL = process.env.PROJECTURL || process.env.PROJECT || await ask('Qual a url do projeto aonde será realizado os commits?', '')
    obj.TOKEN = process.env.TOKEN || await ask('Um token com acesso ao repositório, para gerar um vá à: https://github.com/settings/tokens', '', true)
    obj.ISTEST = !!process.env.test || !!process.env.ISTEST

    const check = { COMMITPATH: mainPath + '/commitMapping', LOOKOUTPATH: process.cwd()}
    for (const [key, value] of Object.entries(check)) {
        if(!process.env[key]) {obj[key] = value} 
    }

    await setEnvironmentVariable(obj)

    if (obj.TOKEN === 'none') {
        warn(`\nA falta do tokens pode gerar problemas no push, caso isso ocorra vá a rota ${process.env.COMMITPATH}/project e faça o push manualmente`)
    }


    return true
}

export {die, born, isOn}