import { exec } from 'child_process'
import { promisify } from 'util'
const execute = promisify(exec)


async function setEnvironmentVariable(obj) {

    for (const [key, value] of Object.entries(obj)) {
        process.env[key] = value
    }

}

export {setEnvironmentVariable}