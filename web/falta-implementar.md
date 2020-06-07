1 - Validacao dos dados

2 - Implementar uma melhor mensagem para quando um novo ponto for cadastrado.

3 - Oferecer a opcao de realizar um novo cadastro para o usuario a partir de um `prompt`onde, 
    caso o usuario diga que sim, fazer um reset de todos os campos. Se nao, volta para a home.

4 - Checar o repositorio(github pessoal)`Municípios Brasileiros`e tentar implementar o recurso para 
    que quando a localizacao nao estiver disponivel, a aplicacao deve fazer uma consulta ao servidor,
    usando o`id`da cidade(retornado pela chamada da API do IBGE) , e o servidor deve realizar uma consulta 
    ao banco de dados e retornar a latitude e longitude da cidade, e estes valores devem ser exibidos como 
    valor padrao mapa para o usuario.
    ***OBS***: A tabela, que ainda vai ser implementada, possui um pouco mais de 5000 cidades com coordenadas.