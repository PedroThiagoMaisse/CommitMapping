# CommitMapping
Um executável de Node que procura todos os repositórios de git na sua máquina, armazena os commmits que você realizou em cada um deles e sobe um espelho deles no projeto desejado.  

Esse espelho conta com as informações:  
- Código do commit;  
- Author;  
- Data;  
- Descrição do commit;
- Número de linhas deletadas, adicionadas e alteradas;

**Não há informações sobre a natureza do projeto daonde o commit surge ou snippets do código.** 

## Rodando

Use ***Em um console com acesso de admin***
>Npx commitMapping


Ou Clone na sua máquina e use
>node .  --looktoutpath c:/Users

dentro do repositório.  

## Variáveis

Essas são as variáveis que o código usa:

| Nome          | Descrição                                                  | Padrão                   | Alias       |
| ------------- | ---------------------------------------------------------- | ------------------------ | ----------- |
| COMMITPATH    | Rota p/ armazenamento do script                            | C:/commitMapping         | commitpath  |
| LOOKOUTPATH   | Rota p/ aonde o crawler inicia                             | C:/Users                 | lookoutpath |
| DRY-RUN       | Impede o push dos dados p/ o projeto                       | False                    | dry-run     |
| TEST          | Impede o push dos dados p/ o projeto                       | False                    | test        |
| AUTHOR        | O Email que serve como filtro nos commits                  | *preenchido por diálogo* | author      |
| PROJECTURL    | A Url do projeto aonde os commits serão feitos             | *preenchido por diálogo* | project     |
| TOKEN         | Um token de acesso p/ a conta                              | *preenchido por diálogo* | token       |
| FORCE         | Pode ser usado para fazer o bypass de algumas verificações | false                    | force       |

Pode-se setar elas as flagando, como:
> npx commitmapping --author example.email --project https://... --token ghpz... --commitpath c:// --lookoutpath c:// --test --force

## Próximos passos
V 1.3 (Re-escritas simples + lidando com bugs)
- Bugs (1/2)
    - Problemas de arquivo travado (como replicar pra começo de conversa)
    - ~Demora para escrever as variáveis no proccess.env (false alarm)~

- Melhoras / Re-escritas
    - Mudar a lingua desse readme para en
    - Achar os maiores problemas de performance (0/1)
        - A parte de commit de arquivo
    - ~Rever o código (5/5)~
        - ~Git Controller~
            - ~Fazer + uma função rodar em paralelo~
            - ~Rever passo a passo a lógica do Modify and Commit~
        - ~Phaser~
        - ~Wrapper (tem algum jeito mais fácil de fazer ele?)~
        - ~Estudar a separação do services para services + utils e o uso do functions~
        - ~Services~

V 2.0 (Automatização da pipeline + Criação de testes)
<details>

- Criação de test
    - ~Nova variável~
    - Criar temp e conferir se existe
    - Clonar um reposítório
        - Fazer o crawler correr pegando alguns outros projetos
        - Conferir o commits nesses projetos

- DevOps
    - ~Criar nova branch p/ teste e PRD~
    - Git Actions (1/4)
        - ~Subir de master p/ PRD~
        - Subir de PRD p/ o NPM
        - Testes automáticos na branch de dev
        - Realizar testes antes de subir de master p/ PRD
</details>

## Finalizados
<details>

V 0 até 1.2.0
- Bugs
    - Melhorar o loop de realização de commits
    - Clonar apenas .git
    - Para alguns projetos o git log não dá retorno
    - Organizar os arquivos de linguas
    - O --test e o --dryrun não travam ou travam tudo
    - Bug no horário
    - Bug no caso do projeto já existir

- Melhorias/re-escritas
    - Disponibilizar em inglês
    - new code order:
        - get envs
        - get language
        - console.clear
        - start flux
        - (Re) Organizar os arquivos;
    - Tentar passar os arquivos para algum lugar temp
    - Criar um padrão de erro no caso de acontecer falhas antes do momento que pegamos o filepath (com a alteração da função de exec p/ cwd ficou redundante);
    - Melhorar a lógica p/ a troca de sistemas operacionais e linguagens (com a alteração p/ a padronização da função exec do node já ficou agnóstico ao sistema operacional e linguagem);
    - Tentar alterar a data do commit pelas próprias opções da API do git (ou mudando as variáveis de ambiente);
    - Criar um wrapper de erros;
    - Melhorar o log de saída do sistemas;
    - Nos detalhes do commit, colocar o número de linhas;
    - Nos detalhes do commit, colocar o nome do projeto; (poderia ser considerado vazamento de info)
    - Não duplicar Commits e não deletar o arquivo atual;
    - Melhorar a leitura do readme;
    - Criar um caso de testes que não pusha;
    - Arrumar as envs de ambiente p/ incluir email, token e repo;
    - Armazenar os commits que deram erro;
    - Error Handler mais completo;
    - Lidar com kill Switchs;
    - Adicionar novas variáveis ao ReadMe;
    - Função de DeleteFile em utils;
    - Mudar o jeito que o crawler funciona p/ evitar a recorrencia da função;
    - Ajustes na escrita e novas tasks;
    - Break o Born() no phaser;
    - Pegar o diretório atual e usar ele para construir as rotas padrões;
    - Possibilitar vários processos de estarem ocupando a thread quando executando em loop;
    - Break o modifyAndCommit() no git.controller;
    - Token e URL estão hardcoded;

DevOps
    - Subir para o NPX (e trocar de nome, talvez);
        - Usar localmente no diretório apontado (quando mudar p/ npx)

</details>