import { loadingAnimation, startConsole, warn } from "../services/console.js"
import { askVars, writingVarsToEnv } from "../services/env.js"
import { ErrorLog } from "../functions/errorHandler.js"
import { deleteFolder } from "../functions/promisses.js"
import chalk from "chalk"
import {verifyLanguage, verifyToken} from "../functions/verify.js"
import { buildText, chooseLang } from "../services/translation.js"
import { sleep } from "../services/utils.js"

let isOn = false


async function exitHandler(options, exitCode) {
    isOn = false
    await loadingAnimation.End(buildText('quit_process'), true)
    await ErrorLog.addNewLog('\n\nFORCED EXIT: ' + exitCode + '\n\n' + JSON.stringify(options))
    await ErrorLog.createLog()
    console.log(chalk.red('\n\nFORCED EXIT!\nSaving details at: ' + process.env.COMMITPATH + '/errors.txt'))
    process.exit();
}

async function die() {
    warn(await buildText('end_process'))
    isOn = false
    loadingAnimation.End('', true)
    await ErrorLog.createLog()
    await deleteFolder(process.env.COMMITPATH + '/temp', { recursive: true, force: true })

    process.exit()
}

async function born() {
    isOn = true        

    console.clear()

    const vars = await writingVarsToEnv()
    await verifyLanguage(vars)

    await chooseLang()

    await startConsole()

    await askVars(vars)

    verifyToken()

    return true

}


export {die, born, isOn, exitHandler}