import { createFolder } from '../services/utils.js'
import { createFile } from '../services/outputs/fs.js'
import { execute, existFile, deleteFolder } from '../functions/promisses.js'

async function cloneProject() {
    const path = process.env.COMMITPATH
    const url = process.env.PROJECTURL
    const token = process.env.TOKEN

    const trueUrl = 'https://' + token + '@' + url.replace("https://", '')
    if(await existFile(process.env.COMMITPATH + '/project')) {await deleteFolder(process.env.COMMITPATH + '/project', { recursive: true, force: true })}
    await execute(`cd ${path} && git clone ${trueUrl} project && git config --global core.autocrlf false`)

    return true
}

async function setProject() {
    const path = process.env.COMMITPATH + '/project/'

    await createFile(path + 'README.md', 'Esse projeto serve apenas como placeholder para demonstrar no histórico do git os pushs feitos em repositórios fechado e de outros sistemas,\nCada commit contem author, data, descrição e url de repositório em suas infos')
    await createFolder(path + 'Commits')

    return true
}

export {cloneProject, setProject}