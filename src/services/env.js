import os from 'os'

function getAndParseArguments() {
    const argumentsArray = process.argv.slice(2)
    const argumentsVariables = {}

    for (let index = 0; index < argumentsArray.length; index++) {
        const element = argumentsArray[index]
        const next = argumentsArray[index + 1]

        if (element.includes('--')) {
            try {
                if (!next.includes('--')) {
                    argumentsVariables[element.slice(2)] = next
                } else { throw('finded')}

            } catch (err) {
                argumentsVariables[element.slice(2)] = true
            }
        }
    }

    return argumentsVariables
}


async function setEnvironmentVariable(vars) {

    for (const [key, value] of Object.entries(vars)) {
        if (!process.env[key])
            process.env[key] = value
    }

}

async function getMainPath() {
    return os.tmpdir()
}


export {setEnvironmentVariable, getMainPath, getAndParseArguments}