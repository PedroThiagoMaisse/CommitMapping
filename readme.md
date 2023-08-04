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
dentro do repositório clonnado.


## SETANDO VARIÁVEIS DE AMBIENTE

Há apenas duas variáveis que o código utiliza:
commitpath : a rota para armazernamento das informações e clonagem / commit dos repositórios
lookatpath : a rota base apartir da qual o crawler irá procurar em cada filho por repositórios

Pode-se setar ela utilizando o git bash como:
> commitpath="" lookatpath="" node.


## PRÓXIMOS PASSOS

Organização de arquivos;
Error Handler mais completo;
Subir para o NPX (e trocar de nome, talvez);
Nos detalhes do commit, colocar o número de linhas;
Nos detalhes do commit, colocar o nome do projeto (e perguntar no setting);
Nos detalhes do commit, colocar as linguagens dos arquivos alterados.
