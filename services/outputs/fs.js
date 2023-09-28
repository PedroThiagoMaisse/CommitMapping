import { _createFile } from '../services/promisses.js'
import { createFolder } from '../services/utils.js'

async function createFile(path, data) {
    // if (typeof data !== String) { data = JSON.stringify(data) }
    
    await createFolder(path.slice(0, path.lastIndexOf('/')))
    await _createFile(path, data)
 }

 export {createFile}