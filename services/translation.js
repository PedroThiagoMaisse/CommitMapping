const text = {
    'en_US.UTF-8': {
        warn: 'Warn: ',
        end_process: "Ending Process",
        start_getProjectUrls: 'Getting all the projects urls',
        end_getProjectUrls: '{{1}} Urls finded',
        start_getLogsFromUrls: 'Getting all commits made by {{1}}',
        end_getLogsFromUrls: 'Commits finded',
        start_transformLogs: 'Transforming Logs in JSON',
        end_transformLogs: 'Done',
        start_commitToGit: 'Modifying Archives and realizing commits',
        end_commitToGit: 'Finished',
        end_dryRun: '\nProject runned in DRY RUN mode, \nArchives changed and Commits done, but the push will not be completed.\n',
        end_test: '\nProject runned in TEST mode, \nArchives changed and Commits done, but the push will not be completed.\n',
        update_logsToJson: '{{1}} commits are invalid to be transformed in JSON',
        update_cloneRepositories: 'Project Cloned: {{1}}',
        error_noRepCloned: 'None Git Clone was able to finish',
        update_modifyAndCommit: '{{1}} succeded, {{2}} already exist, {{3}} error, {{4}} to go',
        end_modifyAndCommit: '\r{{1}} commits succeded, {{2}} already exist and {{3}} errors',
        quit_process: 'Process closed!',
        no_token: '\nA missing token can generate problems during push, if this happens go to {{1}}\\project and do it manually',
        start_process: '\n/----  Starting Flux ----/\n',
        timing: ', in {{1}}ms',
        error_noVar: 'This data is not optional, aborting service...',
        ask_author: 'What is the start of the email (before the @)?',
        ask_project: 'What is the url of the project where the commit will be done?',
        ask_token: 'A token with access to this repo, to generate one go to: https://github.com/settings/tokens'
    },
    'pt_BR.UTF-8': {
        warn: 'Aviso:',
        end_process: "Finalizando processo",
        start_getProjectUrls: 'Pegando Todas as urls de projetos',
        end_getProjectUrls: '{{1}} Urls encontradas',
        start_getLogsFromUrls: 'Pegando todos os commits feitos por {{1}}',
        end_getLogsFromUrls: 'Commits encontrados',
        start_transformLogs: 'Transformando Logs em JSON',
        end_transformLogs: 'Feito',
        start_commitToGit: 'Modificando Arquivos e realizando Commits',
        end_commitToGit: 'Finalizado',
        end_dryRun: '\nProjeto Rodado em modo de dry run, \nArquivos já alterados e Commits feitos, porém o PUSH não será realizado.\n',
        end_test: '\nProjeto Rodado em modo de TESTE, \nArquivos já alterados e Commits feitos, porém o PUSH não será realizado.\n',
        update_logsToJson: '{{1}} commits são inválidos para serem transformados em JSON',
        update_cloneRepositories: 'Projeto Clonado: {{1}}',
        error_noRepCloned: 'Nenhum Git Clone foi capaz de finalizar',
        update_modifyAndCommit: '{{1}} bem sucedidos, {{2}} já existentes, {{3}} erros, faltam {{4}}',
        end_modifyAndCommit: '\r{{1}} commits bem sucedidos, {{2}} já existentes e {{3}} erros',
        quit_process: 'Processo fechado!',
        no_token: '\nA falta do tokens pode gerar problemas no push, caso isso ocorra vá a rota {{1}}\\project e faça o push manualmente',
        start_process: '\n/----  Iniciando o fluxo ----/\n',
        timing: ', em {{1}}ms',
        error_noVar: 'Esse dado não é opcional, abortando o serviço...',
        ask_author: 'Qual o inicio do email (antes do @)?',
        ask_project: 'Qual a url do projeto aonde será realizado os commits?',
        ask_token: 'Um token com acesso ao repositório, para gerar um vá à: https://github.com/settings/tokens'
    }
}

let choosed = {}

async function chooseLang() {
    choosed = text[process.env.LANG]

    return true
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

export {buildText, chooseLang}