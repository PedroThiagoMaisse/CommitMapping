import {crawller, filterFor, generateTempFolder} from '../services/utils.js'
import {getUrlPerPath,cloneRepository, generateFilteredLogs, logsToJson} from './git.controller.js'
import { setEnvironmentVariable } from '../services/Envs.js'
import {ask} from './inOut.controller.js'

async function getAllProjectsURLs() {
    const paths = await filterFor('.git', await crawller())
    const urls = await getUrlPerPath(paths)
    
    return urls
}

async function getLogsFromUrls(urls) {
    const tempFolderPath = await generateTempFolder()
    const clonedReposPath = await cloneRepository(urls, tempFolderPath)
    const logs = await generateFilteredLogs(clonedReposPath)

    return logs
}

async function transformLogs(logs) {
    const JSONLogs = await logsToJson(logs)
    JSONLogs.sort(function (a, b) { return b.Date - a.Date });
    
    return JSONLogs
}

import { exec } from 'child_process'
import { promisify } from 'util'
const execute = promisify(exec)

async function getSetEnvs() {
    const s = await execute(`PowerShell && $Env:author= 'pedro.thiago.aee'`)
    // const author = await ask('Qual o inicio do email (antes do @)?', '')
    // const project = await ask('Qual a url do projeto que deverá ser feito o commit?', '')


    // await setEnvironmentVariable({author, project})


    // console.log(process.env.author)
    // console.log(process.env.project)
}

export {getAllProjectsURLs, getLogsFromUrls, transformLogs, getSetEnvs}