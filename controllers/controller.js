import {crawler, filterFor, generateTempFolder} from '../services/utils.js'
import {getUrlPerPath,cloneRepository, generateFilteredLogs, logsToJson, cloneProject, modifyAndCommit, setProject} from './git.controller.js'
import { log, warn, err, spinner, startLog, finishLog } from '../services/log.js'

async function getAllProjectsURLs() {
    startLog('Pegando Todas as urls de projetos')
    const unfilteredPaths = await crawler()
    const paths = await filterFor('.git', unfilteredPaths)
    const urls = await getUrlPerPath(paths)
    
    finishLog(urls.length + ' Urls encontradas')
    return urls
}

async function getLogsFromUrls(urls) {
    startLog(`Pegando todos os commits feitos por "${process.env.author}"`)
    const tempFolderPath = await generateTempFolder()
    const clonedReposPath = await cloneRepository(urls, tempFolderPath)
    const { array, count } = await generateFilteredLogs(clonedReposPath)

    finishLog(`${count} Commits encontrados`)
    return array
}

async function transformLogs(logs) {
    startLog('Transformando Logs em JSON')
    const JSONLogs = await logsToJson(logs)
    JSONLogs.sort(function (a, b) { return b.Date - a.Date });
    
    finishLog('Feito')
    return JSONLogs
}


async function commitToGit(json) {
    startLog('Modificando Arquivos e realizando Commits')
    await cloneProject()
    await setProject()
    await modifyAndCommit(json)

    finishLog('Finalizado')
    
    return
}


export {getAllProjectsURLs, getLogsFromUrls, transformLogs, commitToGit}