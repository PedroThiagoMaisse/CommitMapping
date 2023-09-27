import { parseArguments } from "./parser"

async function setEnvironmentVariable(obj) {

    for (const [key, value] of Object.entries(obj)) {
        if (!process.env[key])
            process.env[key] = value
    }

}

async function getMainPath() {
    return (await execute('cd')).stdout.split(':')[0] + ':'
}

 
async function writingVarsToEnv() {
    const obj = { COMMITPATH: await getMainPath() + '/commitMapping', LOOKOUTPATH: process.cwd()}

    const options = parseArguments()
    for (const [key, value] of Object.entries(options)) { obj[key.toUpperCase()] = value }

    obj.AUTHOR ??= await ask('Qual o inicio do email (antes do @)?', '')
    obj.PROJECTURL ??= process.env.PROJECT || await ask('Qual a url do projeto aonde será realizado os commits?', '')
    obj.TOKEN ??= await ask('Um token com acesso ao repositório, para gerar um vá à: https://github.com/settings/tokens', '', true)
    obj.ISTEST ??= !!process.env.TEST

    await setEnvironmentVariable(obj)

    return true
}

export {setEnvironmentVariable, getMainPath, writingVarsToEnv}