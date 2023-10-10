import {crawler, filterFor, generateTempFolder, sleep} from '../services/utils.js'
import {getUrlPerPath,cloneRepositories, generateFilteredLogs, logsToJson, cloneProject, modifyAndCommit, setProject} from './git.controller.js'
import { log, warn, err, loadingAnimation } from '../services/console.js'
import {errorHandler} from '../functions/errorHandler.js'
import { execute } from '../functions/promisses.js'
import { buildText } from '../services/translation.js'


async function getAllProjectsURLs() {
    loadingAnimation.Start(buildText('start_getProjectUrls'))
    try {
        const unfilteredPaths = await crawler()
        const paths = await filterFor('.git', unfilteredPaths)
        const urls = await getUrlPerPath(paths)

        loadingAnimation.End(buildText('end_getProjectUrls', urls.length))
        return urls

    } catch (err) {
        errorHandler(err)
    }
}

async function getLogsFromUrls(urls) {
    try {
        loadingAnimation.Start(buildText('start_getLogsFromUrls', process.env.AUTHOR))
        const tempFolderPath = await generateTempFolder()
        const clonedReposPath = await cloneRepositories(urls, tempFolderPath)
        const { array, count } = await generateFilteredLogs(clonedReposPath)

        loadingAnimation.End(buildText('end_getLogsFromUrls', count))
        return array
        
    } catch (err) {
        errorHandler(err)
    }
}

async function transformLogs(logs) {
    try {
        loadingAnimation.Start(buildText('start_transformLogs'))
        const JSONLogs = await logsToJson(logs)
        JSONLogs.sort(function (a, b) { return b.Date - a.Date });
        
        loadingAnimation.End(buildText('end_transformLogs'))
        return JSONLogs

    } catch (err) {
        errorHandler(err)
    }
}


async function commitToGit(json) {
    try {
    loadingAnimation.Start(buildText('start_commitToGit'))
    await cloneProject()
    await setProject()
    await modifyAndCommit(json)
        
    await loadingAnimation.End(buildText('end_commitToGit'))
    
    // if (process.env.TEST != 'false') {
    //     log(buildText('end_test'), 'red')
    //     return false
    // }
        
    // if (process.env["DRY-RUN"] != 'false') {
    //     log(buildText('end_dryRun'), 'red')
    //     return false
    // }
        
    await execute(`git remote set-url origin https://${process.env.TOKEN}@${process.env.PROJECTURL.replaceAll('https://', '')} && git push`, { cwd: process.env.COMMITPATH + '/project' })
    return

    } catch (err) {
        errorHandler(err)
    }
}


export {getAllProjectsURLs, getLogsFromUrls, transformLogs, commitToGit}
