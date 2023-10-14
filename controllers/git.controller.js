import { createFolder, getFile, sleep } from '../services/utils.js'
import { createFile } from '../services/fs.js'
import { loadingAnimation } from '../services/console.js'
import { ErrorLog, errorHandler } from '../functions/errorHandler.js'
import { execute, existFile, deleteFolder } from '../functions/promisses.js'
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
        errorHandler(buildText('error_noRepCloned'))
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
            const start = config.indexOf('remote.origin.url')
            config = config.slice(start)
            const finish = config.indexOf('\n')
            config = config.slice(18, finish)
            if (!returnArray.includes(config) && config !== '') {
                returnArray.push(config)
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
    let author = process.env.AUTHOR
    let count = 0

    for (let index = 0; index < paths.length; index++) {
        const element = paths[index].split('.git')[0]
        try {
            let res = (await execute(`git log --stat`, { cwd: element })).stdout
            array.push({ source: element, data: res })
            const regex = /commit/g
            const found = res.match(regex)
        
            count += found.length
        } catch (err) {
            ErrorLog.addNewLog('ERROR WHILE FILTERING THE PATH: ' + element + '\n, ERROR:' + err)
        }
    }


    return { array, count }
}

async function generateFileInfos(element, path) {
    await createFolder(path + element.Date.getFullYear())
    const filePath = path + element.Date.getFullYear() + '/' + element.Date.getMonth() + '.txt'
    const file = await getFile(filePath)
    let fileInfo = file
    let flip = false
        
    if (!file.includes(element.commit)) {
        flip = true
        fileInfo += `
---------------------------------------------------------
Commit: ${element.commit}
    Author: ${element.Author}
    Date: ${element.Date}
    desc: ${element.desc}
    ${element.details}
`

    }
    return { fileInfo, filePath, flip }
}


async function modifyAndCommit(json) {
    const path = process.env.COMMITPATH + '/project/Commits/'
    let count = 0
    let aCount = 0
    const length = json.length

    for (let index = 0; index < length; index++) {
        loadingAnimation.detail = buildText('update_modifyAndCommit',(index - (count + aCount)),(aCount),(count),(length - index))
        const element = json[index];
        
        if (element.Date == 'Invalid Date') {
            ErrorLog.addRawLog(element)
            count = count + 1
        } else {
            const { fileInfo, filePath, flip } = await generateFileInfos(element, path)

            if (flip) {
                const commitDateObject = getSetDateModel(element.Date)
                const y = createFile(filePath, fileInfo)

                await Promise.all([commitDateObject, y])
                await execute(`git add . && git commit -m "${element.desc}"`, { env: commitDateObject, cwd: path } )
            } else {aCount ++}
        }
    }

    loadingAnimation.AddToLogger(buildText('end_modifyAndCommit', (length - (count + aCount)), aCount, count))        
    return true
}

export {getUrlPerPath, cloneRepositories, generateFilteredLogs, logsToJson, cloneProject, modifyAndCommit, setProject}
