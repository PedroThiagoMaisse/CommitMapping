import { ask } from "./console.js"
import os from 'os'
import { buildText } from "./translation.js"

function parseArguments() {
    const array = process.argv.slice(2)
    const obj = {}

    for (let index = 0; index < array.length; index++) {
        const element = array[index]
        const next = array[index + 1]

        if (element.includes('--')) {
            try {
                if (!next.includes('--')) {
                    obj[element.slice(2)] = next
                } else { throw('finded')}

            } catch (err) {
                obj[element.slice(2)] = true
            }
        }
    }

    return obj
}


async function setEnvironmentVariable(obj) {

    for (const [key, value] of Object.entries(obj)) {
        if (!process.env[key])
            process.env[key] = value
    }

}

async function getMainPath() {
    return os.tmpdir()
}

 
async function writingVarsToEnv() {
    const obj = { COMMITPATH: await getMainPath() + '\\commitMapping', LOOKOUTPATH: process.cwd()}

    const options = parseArguments()
    for (const [key, value] of Object.entries(options)) { obj[key.toUpperCase()] = value }

    obj.AUTHOR ??= await ask(buildText('ask_author'), '')
    obj.PROJECTURL ??= obj.PROJECT || obj.PROJECTURL || await ask(buildText('ask_project'), '')
    obj.TOKEN ??= await ask(buildText('ask_token'), '', true)
    obj.ISTEST ??= !!obj.TEST

    await setEnvironmentVariable(obj)

    return true
}

export {setEnvironmentVariable, getMainPath, writingVarsToEnv}