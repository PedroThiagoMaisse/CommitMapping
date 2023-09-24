# Private Repository Participation Mapping (Aceito sugestões de nomes)

Um executável de Node que procura todos os repositórios de git na sua máquina, armazena os commmits que você realizou em cada um deles e sobe um espelho deles no projeto desejado.  

Esse espelho conta com as informações:  
    Código do commit;  
    Author;  
    Data;  
    Descrição do commit.

Não há informações sobre a natureza do projeto daonde o commit surge ou snippets do código.  

## RODANDO

Use ***Em um console com acesso de admin***
>Npx commitMapping

para rodar ele sem a necessidade de instalar.  

Para rodar com acesso ao código utilize,  
>node .  --looktoutpath c:/Users

dentro do repositório clonado.  

## SETANDO VARIÁVEIS DE AMBIENTE

Essas são as variáveis que o código usa:

| Nome          | Descrição                                      | Padrão                   | Alias       |
| ------------- | ---------------------------------------------- | ------------------------ | ----------- |
| COMMITPATH    | Rota p/ armazenamento do script                | C:/commitMapping         | commitpath  |
| LOOKOUTPATH   | Rota p/ aonde o crawler inicia                 | C:/Users                 | lookoutpath |
| ISTEST        | Impede o push dos dados p/ o projeto           | False                    | test        |
| AUTHOR        | O Email que serve como filtro nos commits      | *preenchido por diálogo* | author      |
| PROJECTURL    | A Url do projeto aonde os commits serão feitos | *preenchido por diálogo* | project     |
| TOKEN         | Um token de acesso p/ a conta                  | *preenchido por diálogo* | token       |

Pode-se setar elas as flagando, como:
> npx commitmapping --author example.email --project https://... --token ghpz... --commitpath c:// --lookoutpath c:// --test

## PRÓXIMOS PASSOS
- Analisar a possibilidade de mudar para o Bun;
- Disponibilizar p/ outros sistemas (atualmente só funciona em windows em pt);
- Tirar a lógica complexa do git controller;
- Organizar melhor o código;
- Quebrar a função de editar e de commitar em 2 diferentes;
- Mudar p/ gitbash;
- Organização de arquivos;
- ~Fazer a execução desse passo acima ser de 10 em 10~ (não funcionaria se continuarmos pelo método de alteração de horário)
    - Testar o set de date pelo commit e não pela máquina;

## FINALIZADOS
<details>
- Criar um wrapper de erros;
- Melhorar o log de saída do sistemas;
- Subir para o NPX (e trocar de nome, talvez);
    - Usar localmente no diretório apontado (quando mudar p/ npx)
- Nos detalhes do commit, colocar o número de linhas;
- Nos detalhes do commit, colocar o nome do projeto; (poderia ser considerado vazamento de info)
- Nos detalhes do commit, colocar as linguagens dos arquivos alterados. (poderia ser considerado vazamento de info)
- URLs dão problema
- Não duplicar Commits e não deletar o arquivo atual;
- Criar um caso de testes que não pusha;
- Melhorar a leitura do readme;
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
- Bug no horário
- Bug no caso do projeto já existir
</details>