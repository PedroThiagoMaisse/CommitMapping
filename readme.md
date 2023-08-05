## COMMIT MAPPING

Um executável de Node que procura todos os repositórios de git na sua máquina, armazena os commmits que você realizou em cada um deles e sobe um espelho deles no projeto desejado. 

Esse espelho conta com as informações: 
    Código do commit; 
    Author; 
    Data; 
    Descrição do commit.

Não há informações sobre a natureza do projeto daonde o commit surge ou snippets do código. 




## RODANDO

Use 
>Npx xxxxxxx@x.x.x 
para rodar ele sem a necessidade de instalar.

Para rodar com acesso ao código utilize,
>node . 
dentro do repositório clonado.




## SETANDO VARIÁVEIS DE AMBIENTE

Essas são as variáveis que o código usa:

commitpath : a rota para armazernamento das informações e clonagem / commit dos repositórios, quando não presente é assumido C:/commitMapping
lookatpath : a rota base apartir da qual o crawler irá procurar em cada filho por repositórios, quando não presente é assumido C:/Users
isTest     : Quando verdadeiro o projeto não irá dar Push dos dados, quando não presente é assumida Falso
author     : o Email para servir como filtro nos commits, *quando não colocado é preenchido por diálogo na cli*
project    : a URL do projeto no qual os commits serão feitos, *quando não colocado é preenchido por diálogo na cli*
token      : um token de acesso da conta no github, *quando não colocado é preenchido por diálogo na cli* 

Pode-se setar ela utilizando o git bash como:
> author="" project="" token="" commitpath="" lookatpath="" isTest="" node ..




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

- Não duplicar Commits e não deletar o arquivo atual;
- Break o modifyAndCommit() no git.controller;
- Break o Born() no phaser;
- Possibilitar vários processos de estarem ocupando a thread quando executando em loop;
- Organização de arquivos;
- Subir para o NPX (e trocar de nome, talvez);
- Nos detalhes do commit, colocar o número de linhas;
- Nos detalhes do commit, colocar o nome do projeto (e perguntar no setting);
- Nos detalhes do commit, colocar as linguagens dos arquivos alterados.
