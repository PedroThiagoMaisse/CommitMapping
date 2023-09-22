import { createFolder, getFile, sleep, setCorrectTime } from '../services/utils.js'
import { createFile } from './inOut.controller.js'
import { spinner } from '../services/log.js'
import { ErrorLog, errorHandler } from '../services/errorHandler.js'
import { execute, existFile, deleteFolder } from '../services/promisses.js'
import { isOn } from './phaser.js'

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
                while(element[element.length-1] === '') {element.pop()}
                const obj = { commit: element[0].trim(), Author: element[1].slice(8), Date: new Date(element[2].slice(8)), desc: element[4].trim(), details: element[element.length - 1]}
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
    let errorCount = 0

    for (let index = 0; index < url.length; index++) {
        const element = url[index];
        createFolder(path + '/' + index).then(() => {
            const output = execute(`cd ${path + '/' + index} && git clone ${element}`).then(() => {
                returnArray.push(path + '/' + index + element.slice(element.lastIndexOf('/')))
                spinner.AddToLogger(`Project Cloned: ${element}`)
                count ++
            }).catch((err) => {
                count ++
                errorCount ++
                ErrorLog.addNewLog(err)
            })
        }).catch((err) => {
            count ++
            errorCount ++
            ErrorLog.addNewLog(err)
        })
    }

    if (errorCount === url.length) {
        errorHandler('NONE GIT CLONE WAS ABLE TO FINISH')
    }

    while (count !== url.length && isOn) {
        await sleep(10)
    }

    return returnArray

}

async function getUrlPerPath(path) {
    if (typeof path !== 'object') {path = [path]}
    const returnArray = []
    let count = 0

    for (let index = 0; index < path.length; index++) {
        const element = process.env.LOOKOUTPATH + '/' +path[index];
        execute(`cd ${element} && git config --list`).then((config) => {
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
        const element = paths[index];
        try {
            let res = (await execute(`cd ${element} && git log --stat --author=${author}`)).stdout
            // console.log(res)
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
    const path = process.env.COMMITPATH
    const url = process.env.PROJECTURL
    const token = process.env.TOKEN

    const trueUrl = 'https://' + token + '@' + url.replace("https://", '')
    if(await existFile(process.env.COMMITPATH + '/project')) {await deleteFolder(process.env.COMMITPATH + '/project', { recursive: true, force: true })}
    await execute(`cd ${path} && git clone ${trueUrl} project && git config --global core.autocrlf false`)

    return true
}

async function setProject() {
    const path = process.env.COMMITPATH + '/project/'

    await createFile(path + 'README.md', 'Esse projeto serve apenas como placeholder para demonstrar no histórico do git os pushs feitos em repositórios fechado e de outros sistemas,\nCada commit contem author, data, descrição e url de repositório em suas infos')
    await createFolder(path + 'Commits')

    return true
}

async function getYearModel(date) {
        let month = date.getMonth() + 1
        if (month < 10) { month = String('0') + String(month) }
        
        let year = String(date.getFullYear()).slice(2)
       
        return  `date ${date.getDate()}-${month}-${year}`
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
        spinner.str = `${index - (count + aCount)} bem sucedidos, ${aCount} já existentes, ${count} erros, faltam ${length - index}  `
        const element = json[index];
        
        if (element.Date == 'Invalid Date') {
            ErrorLog.addRawLog(element)
            count = count + 1
        } else {
        
            const { fileInfo, filePath, flip } = await generateFileInfos(element, path)

            if (flip) {
                const commandToChangeDate = await getYearModel(element.Date)

                await createFile(filePath, fileInfo)
                await execute(`${commandToChangeDate} && cd ${path} && git add . && git commit -m "${element.desc}" --date "${element.Date[Symbol.toPrimitive]('number')}" `)
            } else {aCount ++}
        }
    }

    await setCorrectTime()
    spinner.AddToLogger(`\r${length - (count + aCount)} commits bem sucedidos, ${aCount} já existentes e ${count} erros                  `)
        
    return true
}

export {getUrlPerPath, cloneRepository, generateFilteredLogs, logsToJson, cloneProject, modifyAndCommit, setProject}
