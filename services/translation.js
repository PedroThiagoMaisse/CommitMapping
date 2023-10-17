import { readFile, readFolder } from "../functions/promisses.js"
let choosed = {}

async function chooseLang() {
    const r = await getLanguages()

    for (let index = 0; index < r.length; index++) {
        const element = r[index];
        if (element.replace('.json', '') === process.env.LANG) {
            const s = await readFile('./assets/languages/' + element, 'utf-8')
            choosed = JSON.parse(s)
        }
    }
    
    return
}

async function getLanguages() {
    const r = await readFolder('./assets/languages')

    return r
}

function buildText(textName, arg) {
    let element = JSON.parse(JSON.stringify(choosed))[textName]
    const args = Array.from(arguments)

    for (let index = 1; index < args.length; index++) {
        try {
            const selected = args[index];
            element = element.replaceAll(`{{${index}}}`, selected)
        }
        catch (err) {}
    }

    return element
}

export {buildText, chooseLang, getLanguages}