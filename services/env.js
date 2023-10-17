import { ask } from "./console.js"
import os from 'os'
import { buildText } from "./translation.js"

function getAndParseArguments() {
    const argumentsArray = process.argv.slice(2)
    const argumentsVariables = {}

    for (let index = 0; index < argumentsArray.length; index++) {
        const element = argumentsArray[index]
        const next = argumentsArray[index + 1]

        if (element.includes('--')) {
            try {
                if (!next.includes('--')) {
                    argumentsVariables[element.slice(2)] = next
                } else { throw('finded')}

            } catch (err) {
                argumentsVariables[element.slice(2)] = true
            }
        }
    }

    return argumentsVariables
}


async function setEnvironmentVariable(vars) {

    for (const [key, value] of Object.entries(vars)) {
        if (!process.env[key])
            process.env[key] = value
    }

}

async function getMainPath() {
    return os.tmpdir()
}

 
async function writingVarsToEnv() {
    const variables = { COMMITPATH: await getMainPath() + '\\commitMapping', LOOKOUTPATH: process.cwd()}
    const argumentsVariables = getAndParseArguments()

    for (const [key, value] of Object.entries(argumentsVariables)) { variables[key.toUpperCase()] = value }

    await setEnvironmentVariable(variables)

    return variables
}

async function askVars(obj) {
    
    obj.AUTHOR ??= await ask(buildText('ask_author'), '')
    obj.PROJECTURL ??= obj.PROJECT || obj.PROJECTURL || await ask(buildText('ask_project'), '')
    obj.TOKEN ??= await ask(buildText('ask_token'), '', true)

    await setEnvironmentVariable(obj)

}

export {setEnvironmentVariable, getMainPath, writingVarsToEnv, askVars}