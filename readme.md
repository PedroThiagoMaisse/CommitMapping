# COMMIT MAPPING

Um executável de Node que procura todos os repositórios de git na sua máquina, armazena os commmits que você realizou em cada um deles e sobe um espelho deles no projeto desejado.  

Esse espelho conta com as informações:  
    Código do commit;  
    Author;  
    Data;  
    Descrição do commit.

Não há informações sobre a natureza do projeto daonde o commit surge ou snippets do código.  

## RODANDO

Use  
>Npx xxxxxxx  
para rodar ele sem a necessidade de instalar.  

Para rodar com acesso ao código utilize,  
>node .  
dentro do repositório clonado.  

## SETANDO VARIÁVEIS DE AMBIENTE

Essas são as variáveis que o código usa:

| Nome          | Descrição                                      | Padrão                   |
| ------------- | ---------------------------------------------- | ------------------------ |
| COMMITPATH    | Rota p/ armazenamento do script                | C:/commitMapping         |
| LOOKOUTPATH   | Rota p/ aonde o crawler inicia                 | C:/Users                 |
| ISTEST        | Impede o push dos dados p/ o projeto           | False                    |
| AUTHOR        | O Email que serve como filtro nos commits      | *preenchido por diálogo* |
| PROJECTURL    | A Url do projeto aonde os commits serão feitos | *preenchido por diálogo* |
| TOKEN         | Um token de acesso p/ a conta                  | *preenchido por diálogo* |

Pode-se setar elas utilizando o git bash como:
> AUTHOR="" PROJECTURL="" TOKEN="" COMMITPATH="" LOOKOUTPATH="" ISTEST="" node .

## PRÓXIMOS PASSOS

- ~~Criar um caso de testes que não pusha;~~
- ~~Melhorar a leitura do readme;~~
- ~~Arrumar as envs de ambiente p/ incluir email, token e repo;~~
- ~~Armazenar os commits que deram erro;~~
- ~~Error Handler mais completo;~~
- ~~Lidar com kill Switchs;~~
- ~~Adicionar novas variáveis ao ReadMe;~~
- ~~Função de DeleteFile em utils;~~
- ~~Mudar o jeito que o crawler funciona p/ evitar a recorrencia da função;~~
- ~~Ajustes na escrita e novas tasks;~~
- ~~Break o Born() no phaser;~~
- ~~Pegar o diretório atual e usar ele para construir as rotas padrões;~~

- Não duplicar Commits e não deletar o arquivo atual;
- Break o modifyAndCommit() no git.controller;
- Possibilitar vários processos de estarem ocupando a thread quando executando em loop;
- Organização de arquivos;
- Subir para o NPX (e trocar de nome, talvez);
- Nos detalhes do commit, colocar o número de linhas;
- Nos detalhes do commit, colocar o nome do projeto (e perguntar no setting);
- Nos detalhes do commit, colocar as linguagens dos arquivos alterados.
