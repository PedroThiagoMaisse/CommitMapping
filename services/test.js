import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
const createFolder = promisify(fs.mkdir)
const execute = promisify(exec)

async function danger() {
    const r = await execute('git add .')
    const s = await execute(`git commit -m 'test'`)
    const t = await execute('git push')
    console.log(r)

}


export {danger}