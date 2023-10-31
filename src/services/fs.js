import { _createFile } from '../utils/promisses.js'
import { createFolder } from '../utils/general.js'

async function createFile(path, data) {
    // if (typeof data !== String) { data = JSON.stringify(data) }
    
    await createFolder(path.slice(0, path.lastIndexOf('/')))
    await _createFile(path, data)

    return true
 }

 export {createFile}