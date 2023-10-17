
import inquirer from 'inquirer'
import { die } from '../controllers/phaser.js'
import chalk from "chalk";
import { buildText } from './translation.js';
const separation = `/-----------------------------------------------------/`

function getAndParseArguments() {
    const array = process.argv.slice(2)
    const obj = {}

    for (let index = 0; index < array.length; index++) {
        const element = array[index]
        const next = array[index + 1]

        if (element.includes('--')) {
            try {
                if (!next.includes('--')) {
                    obj[element.slice(2)] = next
                } else { throw('finded')}

            } catch (err) {
                obj[element.slice(2)] = true
            }
        }
    }

    return obj
}


async function startConsole() {
    log(buildText('start_process'), ['inverse'])

    return true
}


async function log(info, style, options) {
    if (typeof style !== 'object') { style = [style] }
    if (typeof options !== 'object') { options = { options } }

    let r = info
    style.forEach(element => {
        if (element) {
            r = chalk[element](r)
        }
    });


    if (options.stdout) {
        process.stdout.write(`\r${r}`)
        return true
    }
    console.log(r)

    return true
}

async function warn(info) {
    log(`${buildText('warn') || 'Warning: '}${info}`, ['yellow', 'bold'])
}

async function err(info) {
    log(`
${separation}
ERROR

${info}
${separation}
`, ['red', 'bold'])
}

const loadingAnimation = {
    loader: null,
    start: null,
    detail: '',
    logger: '',

    ClearLogger: async function () {
        this.logger = ''
    },

    AddToLogger: async function (string) {
        this.logger = chalk.gray(string) + '\n'
    },

    Start: async function (string) {
        log(`\n${string}`)
        this.start = Date.now()
        const P = ['[--=--]', '[---=-]', '[----=]', '[-----]', '[=----]', '[-=---]'];
        let x = 0;
        this.loader = setInterval(() => {
            const visualizer = P[x]
            x++
            if (this.logger !== '') {
                process.stdout.write(`\r${this.logger}              `);
                this.ClearLogger()
            }
            process.stdout.write(`\r${visualizer}  ${chalk.grey(this.detail)}`);
            x %= P.length;
        }, 100)
    },

    End: async function (info, flip) {
        const interval = Date.now() - this.start
        this.start = null

        let complement =  buildText('timing', interval)
        loadingAnimation.detail = ''

        if (!flip)
            log(`${info}${complement}                                 \n`, 'green', { stdout: true })

        clearInterval(this.loader)
        process.stdout.write(`\r${this.logger}           `)
        this.ClearLogger()
        return interval
    }
}

async function getSetDateModel(date) {
    let month = date.getMonth() + 1
    if (month < 10) { month = String('0') + String(month) }
    let year = String(date.getFullYear())

    const commitDate = `${year}-${month}-${date.getDate()}t12:00:00`

    return {
        GIT_AUTHOR_DATE: commitDate,
        GIT_COMMITTER_DATE:  commitDate
    }
}

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
        err(buildText('error_noVar'))
        die()
    }
    return answers.variable
}
 

export{getSetDateModel, ask, log, warn, err, loadingAnimation, startConsole, getAndParseArguments}