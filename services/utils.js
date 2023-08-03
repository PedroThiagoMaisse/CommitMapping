import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
const createFolder = promisify(fs.mkdir)
const deleteFolder = promisify(fs.rm)

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


async function crawller() {
    return `
/Users/729761/Desktop/Projetos/QrcodeKit/agrvai/frontend/.git
/Users/729761/Desktop/Projetos/QrcodeKit/app/.git
/Users/729761/Desktop/Projetos/QrcodeKit/backend/.git
/Users/729761/Desktop/Projetos/QrcodeKit/front pipe/frontend/.git
/Users/729761/Desktop/Projetos/QrcodeKit/frontendOLD/.git
/Users/729761/Desktop/Projetos/QrcodeKit/newApp/my-app/.git`.split('\n')
}

async function generateTempFolder() {
    const path = '/commit_mapping_temp'
    try {
        await createFolder(path)
    }
    catch (err) {
        if (err.code == 'EEXIST') {
            await deleteFolder(path, { recursive: true, force: true })
            await createFolder(path)
        }
    }
    return path 
}


export {crawller, filterFor, generateTempFolder}