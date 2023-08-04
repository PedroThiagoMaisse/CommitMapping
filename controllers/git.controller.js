import { exec } from 'child_process'
import { promisify } from 'util'
import { log } from '../services/log.js'
import fs from 'fs'
import { createFolder, getFile } from '../services/utils.js'
import { createFile } from './inOut.controller.js'
const execute = promisify(exec)
const exist = promisify(fs.exists)
const deleteFolder = promisify(fs.rm)

async function logsToJson(logs) {
    if (typeof logs !== 'object') { logs = [logs] }

    const returnArray = []
    for (let index = 0; index < logs.length; index++) {
        const commits = logs[index].data.split('commit')

        for (let index = 0; index < commits.length; index++) {
            try {
            const element = commits[index].split('\n')
            const obj = {commit: element[0].trim(), Author: element[1].slice(8), Date: new Date(element[2].slice(8)), desc: element[4].trim()}
            returnArray.push(obj)
            }
            catch (err) {}
        }
    }

    return returnArray
}

async function cloneRepository(url, path) {
    if (typeof url !== 'object') { url = [url] }
    const returnArray = []
    
    for (let index = 0; index < url.length; index++) {
        const element = url[index];
        await createFolder(path + '/' + index)
        try {
            let output = (await execute(`cd ${path + '/' + index} && git clone ${element}`)).stdout
        } catch (err) { }
        returnArray.push(path + '/' + index + element.slice(element.lastIndexOf('/')))
        log(`Project Cloned: ${element}`, ['grey'], {stdout: true})
    }

    return returnArray

}

async function getUrlPerPath(path) {
    if (typeof path !== 'object') {path = [path]}
    const returnArray = []

    for (let index = 0; index < path.length; index++) {
        try {
            const element = path[index];
            let config = (await execute(`cd ${element} && git config --list`)).stdout
            const start = config.indexOf('remote.origin.url')
            config = config.slice(start)
            const finish = config.indexOf('\n')
            config = config.slice(18, finish)
            if (!returnArray.includes(config) && config !== '') {
                returnArray.push(config)
            }
        } catch (err) {}
    }


    return returnArray
}

async function generateFilteredLogs(paths) {
    if (typeof paths !== 'object') {paths = [paths]}
    let array = []
    let author = process.env.author
    let count = 0

    for (let index = 0; index < paths.length; index++) {
        try {
            const element = paths[index];
            let res = (await execute(`cd ${element} && git log --author=${author}`)).stdout
            array.push({ source: element, data: res })
            const regex = /commit/g
            const found = res.match(regex)
        
            count += found.length
        } catch (err) { }
    }


    return { array, count }
}

async function cloneProject() {
    const path = process.env.commitpath
    const url = process.env.project
    const token = process.env.token

    const trueUrl = 'https://' + token + '@' + url.replace("https://", '')
    if(await exist(path + '/project')) {deleteFolder(path + '/project', { recursive: true, force: true })}
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
        log(`\r\t ${index} já realizados com ${count} erros, faltam ${length - index}  `, 'grey', { stdout: true })
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
        } else {count = count + 1}
    }
    log(`\r${length - count} commits realizados com ${count} erros                                 `, 'grey', { stdout: true })

    await execute(`date ${u[0]}-${u[1]}-${u[2]}`)
    if (process.env.isTest != 'false') {
        log('\n\nProjeto Rodado em modo de TESTE, \nArquivos já alterados e Commits feitos, porém o PUSH não será realizado.', 'red')
        return false
    }
    await execute(`git remote set-url origin https://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@github.com/PedroThiagoMaisse/CommitMappingTwoEletricBugaloo.git && cd ${path} && git push`)
    
    return true
}

export {getUrlPerPath, cloneRepository, generateFilteredLogs, logsToJson, cloneProject, modifyAndCommit, setProject}