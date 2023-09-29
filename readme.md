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
| ISTEST        | Impede o push dos dados p/ o projeto                       | False                    | test        |
| AUTHOR        | O Email que serve como filtro nos commits                  | *preenchido por diálogo* | author      |
| PROJECTURL    | A Url do projeto aonde os commits serão feitos             | *preenchido por diálogo* | project     |
| TOKEN         | Um token de acesso p/ a conta                              | *preenchido por diálogo* | token       |
| FORCE         | Pode ser usado para fazer o bypass de algumas verificações | false                    | force       |

Pode-se setar elas as flagando, como:
> npx commitmapping --author example.email --project https://... --token ghpz... --commitpath c:// --lookoutpath c:// --test --force

## Próximos passos
- Criar um padrão de erro no caso de acontecer falhas antes do momento que pegamos o filepath
- Tentar passar os arquivos para algum lugar temp
- (Re) Organizar os arquivos
- Talvez mudar para bun (a API de escrever arquivos e de clone parece ser muito mais rápida);
- Melhorar a lógica p/ a troca de sistemas operacionais e linguagens;
- Organizar melhor o código;
- Forçar o sistema a rodar os comandos no GitBash (para facilitar essa padronização na hora de setar datas, abrir arquivos, etc);
- Criar testes

- Disponibilizar para novas linguages / Sistemas
    - Possibiitar a tradução dos logs (como??????)
    - Disponibilizar para EN

## Finalizados
<details>
    
- Melhorar a lógica de tradução (a parte mais complexa disso vai ser descontinuada pela alteração da data ser feito pela própria API do git agora);

- Tentar alterar a data do commit pelas próprias opções da API do git (ou mudando as variáveis de ambiente);

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