import {crawler, filterFor, generateTempFolder} from '../services/utils.js'
import {getUrlPerPath,cloneRepository, generateFilteredLogs, logsToJson, cloneProject, modifyAndCommit, setProject} from './git.controller.js'
import { log, warn, err, spinner, startLog, finishLog } from '../services/log.js'
import {errorHandler} from '../services/errorHandler.js'
import { execute } from '../services/promisses.js'


async function getAllProjectsURLs() {
    startLog('Pegando Todas as urls de projetos')
    try {
        const unfilteredPaths = await crawler()
        const paths = await filterFor('.git', unfilteredPaths)
        const urls = await getUrlPerPath(paths)

        finishLog(urls.length + ' Urls encontradas')
        return urls

    } catch (err) {
        errorHandler(err)
    }
}

async function getLogsFromUrls(urls) {
    try {
        startLog(`Pegando todos os commits feitos por "${process.env.author}"`)
        const tempFolderPath = await generateTempFolder()
        const clonedReposPath = await cloneRepository(urls, tempFolderPath)
        const { array, count } = await generateFilteredLogs(clonedReposPath)

        finishLog(`${count} Commits encontrados`)
        return array
        
    } catch (err) {
        errorHandler(err)
    }
    }

async function transformLogs(logs) {
    try {
        startLog('Transformando Logs em JSON')
        const JSONLogs = await logsToJson(logs)
        JSONLogs.sort(function (a, b) { return b.Date - a.Date });
        
        finishLog('Feito')
        return JSONLogs

    } catch (err) {
        errorHandler(err)
    }
}


async function commitToGit(json) {
    try {
    startLog('Modificando Arquivos e realizando Commits')
    await cloneProject()
    await setProject()
    await modifyAndCommit(json)

    await finishLog('Finalizado')
    
    if (process.env.isTest != 'false') {
        log('\nProjeto Rodado em modo de TESTE, \nArquivos já alterados e Commits feitos, porém o PUSH não será realizado.\n', 'red')
        return false
    }
    await execute(`cd ${process.env.commitpath}/project && git remote set-url origin https://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@github.com/PedroThiagoMaisse/CommitMappingTwoEletricBugaloo.git && git push`)


        return
    } catch (err) {
        errorHandler(err)
    }
}


export {getAllProjectsURLs, getLogsFromUrls, transformLogs, commitToGit}