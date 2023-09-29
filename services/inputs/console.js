import inquirer from 'inquirer'
import { err } from '../outputs/log.js'
import { die } from '../../controllers/phaser/index.js'

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
 
export {ask}