import { exec } from 'child_process'
import { promisify } from 'util'
const execute = promisify(exec)


async function setEnvironmentVariable(obj) {

    for (const [key, value] of Object.entries(obj)) {
        const string = `set ${key}=${value}`
        console.log(string)
        const s = await execute(string, { shell: 'powershell' })
        console.log(s)
    }

}

export {setEnvironmentVariable}