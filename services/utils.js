import { createFile } from '../controllers/inOut.controller.js'
import { ErrorLog, errorHandler } from './errorHandler.js';
import {_createFolder, deleteFolder, readFile, readFolder, existFile} from './promisses.js'

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}


async function createFolder(path) {
    const brokenPath = path.split('/')
    let currentPath = ''

    for (let index = 0; index < brokenPath.length; index++) {
        const element = brokenPath[index];
        if (element != '') {
            currentPath = currentPath ? currentPath + '/' + element : element
            const flip = await existFile(currentPath)
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
    if (!path) { path = process.env.LOOKOUTPATH }
    if (path != '/') { path = path + '/' }
    
    let nextPaths = await readFolder(path)
    let nextFolders = []
    const allPaths = []
    let count = 0


    while (nextPaths.length) {
        nextFolders = []
        for (let index = 0; index < nextPaths.length; index++) {
            const element = nextPaths[index]
            if (element.indexOf('.') === -1 && !element.includes('node_modules')) {
                nextFolders.push(element)
            }

            allPaths.push(element)
        }

        nextPaths = []

        count = 0
        for (let index = 0; index <  nextFolders.length; index++) {
            const element = nextFolders[index]
            readFolder(path + element).then((newPaths) => {
                for (let index = 0; index < newPaths.length; index++) {
                    newPaths[index] = element + '/' + newPaths[index]
                }
                nextPaths.push(...newPaths)
                count ++
            }).catch((err) => {
                ErrorLog.addNewLog(err)
                count ++
            })
        }

        while (count !== nextFolders.length) {
            await sleep(25)
        }


    }

    // throw(500)

    return allPaths
}

async function generateTempFolder() {
    const path = process.env.COMMITPATH + '/temp/'
    if(await existFile(path)) {await deleteFolder(path, { recursive: true, force: true })}
    process.env.COMMITPATHtemp = path
   
    await createFolder(path)
    return path 
}

async function getFile(path) {
    if (!await existFile(path)) {
        createFile(path, '')
        return ''
    }

    const string = await readFile(path, 'utf-8')
    
    return string

}



export {crawler, filterFor, generateTempFolder, createFolder, getFile, sleep}