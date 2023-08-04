import { promisify } from 'util'
import fs from 'fs'
import { createFile } from '../controllers/inOut.controller.js'
const _createFolder = promisify(fs.mkdir)
const deleteFolder = promisify(fs.rm)
const readFile = promisify(fs.readFile)
const readFolder = promisify(fs.readdir)
const exist = promisify(fs.exists)

async function createFolder(path) {
    const brokenPath = path.split('/')
    let currentPath = ''

    for (let index = 0; index < brokenPath.length; index++) {
        const element = brokenPath[index];
        if (element != '') {
            currentPath = currentPath ? currentPath + '/' + element : element
            const flip = await exist(currentPath)
            if (!flip) {
                _createFolder(currentPath)
            }
        }
    }


}

async function filterFor(string, array) {
    const returnArray = []
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element.toLowerCase().includes(string.toLowerCase())) {
            returnArray.push(element)
        }
    }

    return returnArray
}

async function crawler(path) {
    if (!path) { path = process.env.lookatpath }
    if (path != '/') { path = path + '/' }
    
    let array = []
    const y = await readFolder(path)

    for (let index = 0; index < y.length; index++) {
        if (y[index].indexOf('.') === -1 && y[index] !== 'node_modules')
            try {
                const s = await crawler(path + y[index])
                array.push(...s)
            } catch  {
                array.push()
            }
        
        array.push(path + y[index])
    }

    return array
}

async function generateTempFolder() {
    const path = process.env.commitpath + '/temp/'
    if(await exist(path)) {await deleteFolder(path, { recursive: true, force: true })}
    process.env.commitpathtemp = path
   
    await createFolder(path)
    return path 
}

async function getFile(path) {
    if (!await exist(path)) {
        createFile(path, '')
        return ''
    }

    const string = await readFile(path, 'utf-8')
    
    return string

}



export {crawler, filterFor, generateTempFolder, createFolder, getFile}