import { spinner, startConsole, warn } from "../../services/log.js"
import { writingVarsToEnv } from "../../services/Envs.js"
import { ErrorLog } from "../../services/errorHandler.js"
import { deleteFolder } from "../../services/promisses.js"
import chalk from "chalk"
import {verifyLanguage, verifyOS, verifyToken} from "verify.js"

let isOn = false


async function exitHandler(options, exitCode) {
    isOn = false
    spinner.End()
    await ErrorLog.addNewLog('\n\nFORCED EXIT: ' + exitCode + '\n\n' + JSON.stringify(options))
    await ErrorLog.createLog()
    console.log(chalk.red('\n\nFORCED EXIT!\nSalvando detalhes em: ' + process.env.COMMITPATH + '/errors.txt'))
    process.exit();
}

async function die() {
    warn('Finalizando processo')
    isOn = false
    spinner.End()
    await ErrorLog.createLog()
    await deleteFolder(process.env.COMMITPATH + '/temp', { recursive: true, force: true })

    process.exit()
}

async function born() {
    isOn = true
    await startConsole()
    await writingVarsToEnv()
    
    verifyToken()
    await verifyOS()
    await verifyLanguage()

    return true

}


export {die, born, isOn, exitHandler}