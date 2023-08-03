const fs = require('fs/promises');
const { exec } = require('node:child_process');

async function getAllCommitsBy(_author) {
    const returnObj = {}
    const array = []
    const _array = await fs.readdir('./Logs')
    for (let index = 0; index < _array.length; index++) {
        const _element = _array[index];
        const s = await readFile('./Logs/' + _element)
        let r = s.split('commit')
        let obj = {}
        const project = _element.slice(0, -4)

        r.forEach(element => {
            const f = element.split('\r\n')
            if (f[1]) {
                const author = f[1].slice(f[1].indexOf('<') + 1, f[1].indexOf('>'))
                if (author === _author) {
                    const date = new Date(f[2].slice(5))
                    const alterDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
                    const desc = f[4].trim()
                    obj = { author, desc, project, commit: f[0] }
                    if (returnObj[alterDate]) {
                        returnObj[alterDate].push(obj)
                    } else {returnObj[alterDate] = [obj]}
                }
            }
        });
    }
    const lastArray = []
    
    for (const [key, value] of Object.entries(returnObj)) {
        lastArray.push({ array: value, date: key })
    }

    let str5 = ''

    for (let index = 0; index < lastArray.length; index++) {
        const element = lastArray[index];
        let test = ''
        element.array.forEach(element => {
            let str = JSON.stringify(element).replaceAll(',', `,\n\t`).replaceAll('}', `\n}`).replaceAll('{', `{\n\t`)
            test += test ? ',\n' + str : str
        });
    
        test = `\t"date": "${element.date}", \n"array": \n${test}`
        test = `{\n${test.replaceAll("\n", "\n\t")}\n}`
        str5 += str5 ? ',\n' + test : test
    }

    str5 = `[\n\t${str5.replaceAll("\n", "\n\t")}\n]`
    await fs.writeFile('./output.txt', str5)
}

async function readFile(path) {
    try {
      const data = await fs.readFile(path, { encoding: 'utf8' });
        // console.log(data); 
        return data
    } catch (err) {
      console.log(err);
    }
}

async function crawler(path) {
    if (path != '/') {path = path + '/'}
    let array = []
    const y = await fs.readdir(path)

    for (let index = 0; index < y.length; index++) {
        if (y[index].indexOf('.') === -1 && y[index] !== 'node_modules')
            try {
                // array.push(path + '/' + y[index])
                const s = await crawler(path + y[index])
                array.push(...s)
            } catch  {
                array.push()
            }
        
        array.push(path + y[index])
    }

    return array
}

// console.log('?')
// console.time('func')
// console.timeLog('func')
// const s = await crawler('/Users/729761')
// let string = ''

// const s = await fs.readFile('./output.txt')

// console.timeLog('func')
// s.forEach(element => {
//     string = string + '\n' + element
// });
// console.timeLog('func')

// await fs.writeFile('./output.txt', string)
// console.timeLog('func')

let exportArray = ''

const s = (await readFile('./output.txt')).split('\n')

s.forEach(element => {
    if (element.slice(-4) === '.git') {
        exportArray += '\n' + element
    }
});

const {stdout, stderr} = exec('cd users')

await fs.writeFile('./git.txt', exportArray)