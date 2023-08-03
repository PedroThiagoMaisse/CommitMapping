import inquirer from 'inquirer'

async function ask(question, defaultAnswer) {
    const answers = await inquirer.prompt({
        name: 'variable',
        type: 'input',
        message: question || '...',
        default() {
            return defaultAnswer || 'none';
        },
    })

    return answers.variable

 }


export {ask}