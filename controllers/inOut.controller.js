import inquirer from 'inquirer'
import { promisify } from 'util'
import fs from 'fs'
const existFile = promisify(fs.exists)
const _createFile = promisify(fs.writeFile)
import { createFolder } from '../services/utils.js'
import { err } from '../services/log.js'
import { die } from './phaser.js'

async function ask(question, defaultAnswer, isOptional) {
    const answers = await inquirer.prompt({
        name: 'variable',
        type: 'input',
        message: question || '...',
        default() {
            return defaultAnswer || 'none';
        },
    })
 

    if (answers.variable === 'none' && !isOptional) {
        err('Esse dado não é opcional, abortando o serviço...')
        die()
    }
    return answers.variable
 }

async function createFile(path, data) {
    // if (typeof data !== String) { data = JSON.stringify(data) }
    
    await createFolder(path.slice(0, path.lastIndexOf('/')))
    await _createFile(path, data)
 }

export {ask, createFile}