import { _createFile } from '../../functions/promisses.js'
import { createFolder } from '../utils.js'

async function createFile(path, data) {
    // if (typeof data !== String) { data = JSON.stringify(data) }
    
    await createFolder(path.slice(0, path.lastIndexOf('/')))
    await _createFile(path, data)
 }

 export {createFile}