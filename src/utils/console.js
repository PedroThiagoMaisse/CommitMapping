import { log } from "../services/console.js"
import { buildText } from "../services/translation.js"
const separation = `/-----------------------------------------------------/`

async function startConsole() {
    log(buildText('start_process'), ['inverse'])

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

export {err, warn, startConsole}