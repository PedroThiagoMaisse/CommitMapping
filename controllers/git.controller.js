import { createFolder, getFile } from '../services/utils.js'
import { createFile } from './inOut.controller.js'
import { spinner } from '../services/log.js'
import { ErrorLog, errorHandler } from '../services/errorHandler.js'
import { execute, existFile, deleteFolder } from '../services/promisses.js'

async function logsToJson(logs) {
    if (typeof logs !== 'object') { logs = [logs] }
    let count = 0
    let obj = {}

    const returnArray = []
    for (let index = 0; index < logs.length; index++) {
        const commits = logs[index].data.split('commit')

        for (let index = 0; index < commits.length; index++) {
            let element = commits[index].split('\n')
            try {
                if (commits[index].toLowerCase().includes('merge')) {
                    element = element.splice(1, 2)
                }
                const obj = { commit: element[0].trim(), Author: element[1].slice(8), Date: new Date(element[2].slice(8)), desc: element[4].trim() }
                returnArray.push(obj)
            } catch (err) {
                if (element != '') {
                    count++
                    ErrorLog.addNewLog('Cannot produce JSON from commit: "' + element + '"\n Error: ' + err)
                }
            }
        }
    }

    if(count)spinner.AddToLogger(`${count} commits são inválidos para serem transformados em JSON`)
    return returnArray
}

async function cloneRepository(url, path) {
    if (typeof url !== 'object') { url = [url] }
    const returnArray = []
    let count = 0

    for (let index = 0; index < url.length; index++) {
        const element = url[index];
        await createFolder(path + '/' + index)
        try {
            let output = (await execute(`cd ${path + '/' + index} && git clone ${element}`)).stdout
        } catch (err) {
            count ++
            ErrorLog.addNewLog(err)
        }
        returnArray.push(path + '/' + index + element.slice(element.lastIndexOf('/')))
        spinner.AddToLogger(`Project Cloned: ${element}`)
    }

    if (count === url.length) {
        errorHandler('NONE GIT CLONE WAS ABLE TO FINISH')
    }

    return returnArray

}

async function getUrlPerPath(path) {
    if (typeof path !== 'object') {path = [path]}
    const returnArray = []

    for (let index = 0; index < path.length; index++) {
        const element = process.env.lookatpath + '/' +path[index];
        try {
            let config = (await execute(`cd ${element} && git config --list`)).stdout
            const start = config.indexOf('remote.origin.url')
            config = config.slice(start)
            const finish = config.indexOf('\n')
            config = config.slice(18, finish)
            if (!returnArray.includes(config) && config !== '') {
                returnArray.push(config)
            }
        } catch (err) {
            ErrorLog.addNewLog('ERROR WHILE GETTING URL: ' + element + '\n, ERROR:' + err)
        }
    }


    return returnArray
}

async function generateFilteredLogs(paths) {
    if (typeof paths !== 'object') {paths = [paths]}
    let array = []
    let author = process.env.author
    let count = 0

    for (let index = 0; index < paths.length; index++) {
        const element = paths[index];
        try {
            let res = (await execute(`cd ${element} && git log --author=${author}`)).stdout
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

async function cloneProject() {
    const path = process.env.commitpath
    const url = process.env.project
    const token = process.env.token

    const trueUrl = 'https://' + token + '@' + url.replace("https://", '')
    if(await existFile(process.env.commitpath + '/project')) {deleteFolder(process.env.commitpath + '/project', { recursive: true, force: true })}
    await execute(`cd ${path} && git clone ${trueUrl} project`)

    return true
}

async function setProject() {
    const path = process.env.commitpath + '/project/'

    await createFile(path + 'README.md', 'Esse projeto serve apenas como placeholder para demonstrar no histórico do git os pushs feitos em repositórios fechado e de outros sistemas,\nCada commit contem author, data, descrição e url de repositório em suas infos')
    await createFolder(path + 'Commits')

    return true
}

async function modifyAndCommit(json) {
    const s = await execute('date /t')
    const u = s.stdout.split('/')
    const path = process.env.commitpath + '/project/Commits/'
    let count = 0
    const length = json.length

    for (let index = 0; index < length; index++) {
        spinner.str = `${index - count} bem sucedidos, ${count} erros, faltam ${length - index}  `
        const element = json[index];
        await createFolder(path + element.Date.getFullYear())
        const filePath = path + element.Date.getFullYear() + '/' + element.Date.getMonth() + '.txt'
        const file = await getFile(filePath)

        const str = file + `
---------------------------------------------------------
Commit: ${element.commit}
    Author: ${element.Author}
    Date: ${element.Date}
    desc: ${element.desc}
`

        await createFile(filePath, str)
        let month = element.Date.getMonth() + 1
        if (month < 10) { month = String('0') + String(month) }
        
        let year = String(element.Date.getFullYear()).slice(2)
       
        const str5 = `date ${element.Date.getDate()}-${month}-${year}`
        if (element.Date != 'Invalid Date') {
            const r = await execute(str5)
            await execute(`cd ${path} && git add . && git commit -m "${element.desc}" --date "${element.Date[Symbol.toPrimitive]('number')}" `)
        } else {
            ErrorLog.addRawLog(str)
            count = count + 1
        }
    }

    
    await execute(`date ${u[0]}-${u[1]}-${u[2]}`)

    spinner.AddToLogger(`\r${length - count} commits bem sucedidos e ${count} erros                  `)
        
    return true
}

export {getUrlPerPath, cloneRepository, generateFilteredLogs, logsToJson, cloneProject, modifyAndCommit, setProject}