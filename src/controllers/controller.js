import {crawler, filterFor, generateTempFolder, sleep} from '../utils/general.js'
import {getUrlPerPath,cloneRepositories, generateFilteredLogs, logsToJson, cloneProject, modifyAndCommit, setProject} from './git.controller.js'
import { log, loadingAnimation } from '../services/console.js'
import { execute } from '../functions/promisses.js'
import { buildText } from '../services/translation.js'


async function getAllProjectsURLs() {
    loadingAnimation.Start(buildText('start_getProjectUrls'))
    const unfilteredPaths = await crawler()
    const paths = await filterFor('.git', unfilteredPaths)
    const urls = await getUrlPerPath(paths)

    loadingAnimation.End(buildText('end_getProjectUrls', urls.length))
    return urls
}

async function getLogsFromUrls(urls) {
    loadingAnimation.Start(buildText('start_getLogsFromUrls', process.env.AUTHOR))
    const tempFolderPath = await generateTempFolder()
    const clonedReposPath = await cloneRepositories(urls, tempFolderPath)
    const { array, count } = await generateFilteredLogs(clonedReposPath)

    loadingAnimation.End(buildText('end_getLogsFromUrls', count))
    return array
}

async function transformLogs(logs) {
    loadingAnimation.Start(buildText('start_transformLogs'))
    const JSONLogs = await logsToJson(logs)
    JSONLogs.sort(function (a, b) { return b.Date - a.Date });
    
    loadingAnimation.End(buildText('end_transformLogs'))
    return JSONLogs
}


async function commitToGit(json) {
    loadingAnimation.Start(buildText('start_commitToGit'))
    await cloneProject()
    await setProject()
    await modifyAndCommit(json)
        
    await loadingAnimation.End(buildText('end_commitToGit'))
    
    await sleep(500)
    if (process.env.TEST != 'false' && process.env.TEST) {
        log(buildText('end_test'), 'red')
        return false
    }
        
    if (process.env["DRY-RUN"] != 'false' && process.env["DRY-RUN"]) {
        log(buildText('end_dryRun'), 'red')
        return false
    }
        
    log("\n")
    log(buildText("start_commit"), 'green')
    
    await execute(`git remote set-url origin https://${process.env.TOKEN}@${process.env.PROJECTURL.replaceAll('https://', '')} && git push`, { cwd: process.env.COMMITPATH + '/project' })
    
    log(buildText("end_commit"), 'green')
    return
}


export {getAllProjectsURLs, getLogsFromUrls, transformLogs, commitToGit}
