import chalk from "chalk";
const sep = `/-----------------------------------------------------/`

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
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
    log(`Aviso: ${info}`, ['yellow', 'bold'])
}

async function err(info) {
    log(`\n${sep}\nERROR\n\n${info}\n${sep}\n`, ['red', 'bold'])
}

const spinner = {
    loader: null,
    start: null,
    str: '',
    logger: '',

    ClearLogger: async function () {
        this.logger = ''
    },

    AddToLogger: async function (string) {
        this.logger = chalk.gray(string) + '\n'
    },

    Start: async function () {
        this.start = Date.now()
        const P = ['[--=--]', '[---=-]', '[----=]','[-----]','[=----]','[-=---]'];
        let x = 0;
        this.loader = setInterval(() => {
            const visualizer = P[x]
            x++
            if (this.logger !== '') {
                process.stdout.write(`\r${this.logger}              `);
                this.ClearLogger()
            }
            process.stdout.write(`\r${visualizer}  ${chalk.grey(this.str)}`);
            x %= P.length;
        }, 100);
    },

    End: async function () {
        const interval = Date.now() - this.start
        this.start = null
        clearInterval(this.loader)
        process.stdout.write(`\r${this.logger}           `)
        this.ClearLogger()
        return interval
    }
}

async function startLog(info) {
    log(`\n${info}`)
    await spinner.Start()
}

async function finishLog(info) {
    const interval = await spinner.End()
    let complement = ''
    if (interval > 1500) { complement = `, em ${interval / 1000}s` }
    else { complement = `, em ${interval}ms` }
    
    spinner.str = ''

    log(`${info}${complement}                                 \n`, 'green', { stdout: true })
    
    return
}

export {startLog, finishLog, log, warn, err, spinner}