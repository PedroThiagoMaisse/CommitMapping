import {setEnvironmentVariable, getAndParseArguments, getMainPath} from '../services/env.js'
import { ask } from 'my-organizer/services/inquirer.js' 
import { buildText } from "../services/translation.js"

async function writingVarsToEnv() {
    const variables = { COMMITPATH: await getMainPath() + '\\commitMapping', LOOKOUTPATH: process.cwd()}
    const argumentsVariables = getAndParseArguments()

    for (const [key, value] of Object.entries(argumentsVariables)) { variables[key.toUpperCase()] = value }

    await setEnvironmentVariable(variables)

    return variables
}


async function askVars() {
    const vars = {AUTHOR: process.env.AUTHOR, PROJECTURL: process.env.PROJECTURL, TOKEN: process.env.TOKEN}

    vars.AUTHOR ??= await ask(buildText('ask_author'), '')
    vars.PROJECTURL ??= process.env.PROJECT || process.env.PROJECTURL || await ask(buildText('ask_project'), '')
    vars.TOKEN ??= await ask(buildText('ask_token'), '', true)

    await setEnvironmentVariable(vars)

}

export {writingVarsToEnv, askVars}