import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
const createFolder = promisify(fs.mkdir)
const execute = promisify(exec)

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
    }

    return returnArray

}

async function getUrlPerPath(path) {
    if (typeof path !== 'object') {path = [path]}
    const returnArray = []

    for (let index = 0; index < path.length; index++) {
        const element = path[index];
        let config = (await execute(`cd ${element} && git config --list`)).stdout
        const start = config.indexOf('remote.origin.url')
        config = config.slice(start)
        const finish = config.indexOf('\n')
        config = config.slice(18, finish)
        if (!returnArray.includes(config) && config !== '') {
            returnArray.push(config)
        }
    }


    return returnArray
}

async function generateFilteredLogs(paths) {
    if (typeof paths !== 'object') {paths = [paths]}
    let str = []
    let author = process.env.author

    for (let index = 0; index < paths.length; index++) {
        try {
            const element = paths[index];
            let res = (await execute(`cd ${element} && git log --author=${author}`)).stdout
            str.push({source: element, data: res})
        } catch (err) {}
    }


    return str
}

export {getUrlPerPath, cloneRepository, generateFilteredLogs, logsToJson}