const text = {
    'pt_BR.UTF-8': {
        closing: "Finalizando processo"
        
    },
    'en_US.UTF-8': { closing: "Closing process"}
}

let choosed = {}

async function chooseLang() {
    choosed = text[process.env.LANG]

    return true
}

async function buildText(textName, arg) {
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

export {buildText, chooseLang}