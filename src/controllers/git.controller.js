import { createFolder, getFile, sleep } from '../utils/general.js'
import { createFile } from '../services/fs.js'
import { loadingAnimation } from '../services/console.js'
import { ErrorLog } from '../utils/errorHandler.js'
import { execute } from '../utils/promisses.js'
import { isOn } from './phaser.js'
import { getSetDateModel } from '../services/console.js'
import { setProject, cloneProject } from '../services/git.js'
import {buildText} from '../services/translation.js'

async function logsToJson(logs) {
    if (typeof logs !== 'object') { logs = [logs] }
    let count = 0

    const returnArray = []
    for (let index = 0; index < logs.length; index++) {
        if (logs[index].data) {
            const commits = logs[index].data.split('commit')
            for (let index = 0; index < commits.length; index++) {
                let element = commits[index].split('\n')
                try {
                    if (commits[index].toLowerCase().includes('merge')) {
                        element = element.splice(1, 2)
                    }
                    while (element[element.length - 1] === '') { element.pop() }
                    const obj = { commit: element[0].trim(), Author: element[1].slice(8), Date: new Date(element[2].slice(8)), desc: element[4].trim(), details: element[element.length - 1] }
                    returnArray.push(obj)
                } catch (err) {
                    if (element != '') {
                        count++
                        ErrorLog.addNewLog('Cannot produce JSON from commit: "' + element + '"\n Error: ' + err)
                    }
                }
            }
        }
    }

    if(count)loadingAnimation.AddToLogger(buildText('update_logsToJson', count))
    return returnArray
}

async function cloneRepositories(url, path) {
    if (typeof url !== 'object') { url = [url] }
    const returnArray = []
    let count = 0
    let errorCount = 0

    for (let index = 0; index < url.length; index++) {
        const element = url[index]
        createFolder(path + '/' + index)
            .then(() => {
                execute(`git clone --no-checkout ${element}`, {cwd: path+ '/' + index})
                    .then(() => {
                        returnArray.push(path + '/' + index + element.slice(element.lastIndexOf('/')))
                        loadingAnimation.AddToLogger( buildText('update_cloneRepositories', element))
                        count ++
                    }).catch((err) => {
                        count ++
                        errorCount ++
                        ErrorLog.addNewLog(err)
                    })
            })
            .catch((err) => {
                count ++
                errorCount ++
                ErrorLog.addNewLog(err)
            })
    }

    if (errorCount === url.length) {
        throw(buildText('error_noRepCloned'))
    }

    while (count !== url.length && isOn) {
        await sleep(25)
    }

    return returnArray

}

async function getUrlPerPath(path) {
    if (typeof path !== 'object') {path = [path]}
    const returnArray = []
    let count = 0

    for (let index = 0; index < path.length; index++) {
        const element = process.env.LOOKOUTPATH + '/' +path[index];
        execute(`git config --list`, {cwd: element}).then((config) => {
            config = config.stdout
            const startOfString = config.slice(config.indexOf('remote.origin.url'))
            const FinalString = startOfString.slice(18, startOfString.indexOf('\n'))

            if (!returnArray.includes(FinalString) && FinalString !== '') {
                returnArray.push(FinalString)
            }
            count ++
        }).catch((err) => {
            ErrorLog.addNewLog('ERROR WHILE GETTING URL: ' + element + '\n, ERROR:' + err)  
            count ++
        })
    }

    while (count !== path.length && isOn) {
        await sleep(10)
    }

    return returnArray
}

async function generateFilteredLogs(paths) {
    if (typeof paths !== 'object') {paths = [paths]}
    let array = []
    let count = 0
    let errorCount = 0
    let successCount = 0

    for (let index = 0; index < paths.length; index++) {
        const element = paths[index].split('.git')[0]
        try {
            execute(`git log --stat --author=` + process.env.Author, { cwd: element, maxBuffer: 1024 * 1024 * 10}).then((res) => {
                array.push({ source: element, data: res.stdout })
                const regex = /commit/g
                const found = res.stdout.match(regex)
                count += found ? found.length : 0
                successCount++
                res.stdout = ''
            })
        } catch (err) {
            ErrorLog.addNewLog('ERROR WHILE FILTERING THE PATH: ' + element + '\n, ERROR:' + err)
            errorCount ++
        }
    }

    while (paths.length !== (errorCount + successCount) && isOn) {
        await sleep(50)
    }

    return { array, count }
}

async function generateFileInfos(element, path) {
    await createFolder(path + element.Date.getFullYear())
    const filePath = path + element.Date.getFullYear() + '/' + element.Date.getMonth() + '.txt'
    const file = await getFile(filePath)
    let fileInfo = file
    let newCommit = false
        
    if (!file.includes(element.commit)) {
        newCommit = true
        fileInfo += `
---------------------------------------------------------
Commit: ${element.commit}
    Author: ${element.Author}
    Date: ${element.Date}
    desc: ${element.desc}
    ${element.details}
`

    }
    return { fileInfo, filePath, newCommit }
}


async function modifyAndCommit(json) {
    const commitPath = process.env.COMMITPATH + '/project/Commits/'
    let errorCount = 0
    let commitedPreviously = 0
    const length = json.length

    for (let index = 0; index < length; index++) {
        const Successes = (index - (errorCount + commitedPreviously))
        loadingAnimation.detail = buildText('update_modifyAndCommit',(Successes),(commitedPreviously),(errorCount),(length - index))
        const element = json[index];
        
        if (element.Date == 'Invalid Date') {
            ErrorLog.addRawLog(element)
            errorCount = errorCount + 1
        } else {
            const { fileInfo, filePath, newCommit } = await generateFileInfos(element, commitPath)

            if (newCommit) {
                const commitDateObject = await getSetDateModel(element.Date)
                await createFile(filePath, fileInfo)

                await execute(`git add . && git commit -m "${element.desc.replaceAll('"', "'")}"`, { env: commitDateObject, cwd: commitPath } )
            } else {commitedPreviously ++}
        }
    }

    const Successes = length - (errorCount + commitedPreviously)
    loadingAnimation.AddToLogger(buildText('end_modifyAndCommit', Successes, commitedPreviously, errorCount))        
    return true
}

export {getUrlPerPath, cloneRepositories, generateFilteredLogs, logsToJson, cloneProject, modifyAndCommit, setProject}
