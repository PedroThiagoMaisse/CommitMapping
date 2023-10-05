import {crawler, filterFor, generateTempFolder} from '../services/utils.js'
import {getUrlPerPath,cloneRepositories, generateFilteredLogs, logsToJson, cloneProject, modifyAndCommit, setProject} from './git.controller.js'
import { log, warn, err, loadingAnimation } from '../services/console.js'
import {errorHandler} from '../functions/errorHandler.js'
import { execute } from '../functions/promisses.js'


async function getAllProjectsURLs() {
    loadingAnimation.Start('Pegando Todas as urls de projetos')
    try {
        const unfilteredPaths = await crawler()
        const paths = await filterFor('.git', unfilteredPaths)
        const urls = await getUrlPerPath(paths)

        loadingAnimation.End(urls.length + ' Urls encontradas')
        return urls

    } catch (err) {
        errorHandler(err)
    }
}

async function getLogsFromUrls(urls) {
    try {
        loadingAnimation.Start(`Pegando todos os commits feitos por "${process.env.AUTHOR}"`)
        const tempFolderPath = await generateTempFolder()
        const clonedReposPath = await cloneRepositories(urls, tempFolderPath)
        const { array, count } = await generateFilteredLogs(clonedReposPath)

        loadingAnimation.End(`${count} Commits encontrados`)
        return array
        
    } catch (err) {
        errorHandler(err)
    }
}

async function transformLogs(logs) {
    try {
        loadingAnimation.Start('Transformando Logs em JSON')
        const JSONLogs = await logsToJson(logs)
        JSONLogs.sort(function (a, b) { return b.Date - a.Date });
        
        loadingAnimation.End('Feito')
        return JSONLogs

    } catch (err) {
        errorHandler(err)
    }
}


async function commitToGit(json) {
    try {
    loadingAnimation.Start('Modificando Arquivos e realizando Commits')
    await cloneProject()
    await setProject()
    await modifyAndCommit(json)
        
    await loadingAnimation.End('Finalizado')
    
    if (process.env.ISTEST != 'false') {
        log('\nProjeto Rodado em modo de TESTE, \nArquivos já alterados e Commits feitos, porém o PUSH não será realizado.\n', 'red')
        return false
    }
        
    if (process.env["DRY-RUN"] != 'false') {
        log('\nProjeto Rodado em modo de DRY-RUN, \nArquivos já alterados e Commits feitos, porém o PUSH não será realizado.\n', 'red')
        return false
    }
        
        await execute(`git remote set-url origin https://${process.env.TOKEN}@${process.env.PROJECTURL.replaceAll('https://', '')} && git push`, { cwd: process.env.COMMITPATH + '/project' })
    return

    } catch (err) {
        errorHandler(err)
    }
}


export {getAllProjectsURLs, getLogsFromUrls, transformLogs, commitToGit}
