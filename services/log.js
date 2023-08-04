import chalk from "chalk";
const sep = `/-----------------------------------------------------/`



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
    log(`Warning: ${info}`, ['yellow', 'bold'])
}

async function err(info) {
    log(`\n${sep}\nERROR\n\n${info}\n${sep}\n`, ['red', 'bold'])
}

const spinner = {
    loader: null,
    start: null,

    Start: async function () {
        this.start = Date.now()
        const P = ['\\', '|', '/', '-'];
        let x = 0;
        this.loader = setInterval(() => {
        process.stdout.write(`\r${P[x++]}`);
        x %= P.length;
        }, 250);
    },

    End: async function () {
        const interval = Date.now() - this.start
        this.start = null
        clearInterval(this.loader)
        process.stdout.write('\r')
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
    
    log(`\n${info}${complement}\n`, 'green')
}

export {startLog, finishLog, log, warn, err, spinner}