# Tutorial para projetos SpringBoot

## Necessário
Para rodar, é necessário ter a versão 21 do [jdk](https://www.oracle.com/br/java/technologies/downloads/#java21) (java) instalado em sua máquina.
Fazer as configurações na IDE de sua preferência, para conseguir executar o java.

Além disso é necessário ter o SGBD Postgres funcionando em sua máquina, pois é o banco de dados utilizado pela aplicação.

## Variáveis de ambiente
A aplicação exige algumas variáveis configuradas para funcionar do jeito que deve. Para isso, as variáveis devem ser criadas no deu sistema operacional.

As variáveis utilizadas podem ser encontradas no arquivo `application.yaml`, sendo as seguintes:
* `DB_URL` -> Caminho do banco de dados postgres criado na sua máquina, criado seguindo o modelo: `jdbc:postgresql://ipDaMaquina:portaDoBanco/nomeDoBanco`;
<br><br>_OBS: para apontar para sua máquina insira 'localhost' no lugar do IP e a porta padrão é '5432'_ <br><br>
* `DB_USERNAME` -> Nome do usuário no postgres que fará a conexão;
* `DB_PASSWORD` -> Senha do usuário no postgres que fará a conexão;
<br><br> _OBS: Por padrão, esses dois valores são criados como 'postgres' na instalação do banco de dados._ <br><br>
* `EMAIL_SECRET` -> Endereço de e-mail que será utilizado nos serviços de envio de e-mail do sistema;
* `PASSWORD_SECRET` -> Senha do e-mail que será utilizado nos serviços de envio de e-mail do sistema;
* `FRONTEND_URL` -> **Opcional**. Endereço do servidor frontend, por padrão a aplicação define como 'http://localhost:3000';
* `JWT_SECRET` -> **Opcional**. Modelo de geração do Token JWT, não é necessário modificar.

### Adicionando variáveis no Windows:
* Pesquisar por "_Editar as variáveis de ambiente do sistema_"
* Ir em _Variáveis de Ambiente_
 <br>![image](https://github.com/user-attachments/assets/1b6ddcce-ec09-448f-84f8-6be09071f36c)
* Na janela exibida clicar em "_Novo_" e adicionar as variáveis com a nome informado abaixo e o valor referente na sua máquina.


## Iniciando

Para iniciar a aplicação SpringBoot, executar o arquivo `RepositorioDeTccApplication`.<br> 
As devidas dependências serão baixadas e instaladas automaticamente.

## Extra
Estamos utilizando Migration, então fique atento a modificações feitas diretamentes no banco de dados sem a criação dos devidos arquivos dentro da aplicação SpringBoot.
Caso ocorra algum erro que envolva `flyway`, pode ser necessário recriar o banco de dados.


## Leia mais
* [Instalação do Java](https://www.treinaweb.com.br/blog/como-instalar-o-java-e-nosso-primeiro-exemplo)
* [Documentação do Spring Boot](https://spring.io/projects/spring-boot)
* [Executando no Visual Studio Code](https://medium.com/@alexandre.therrien3/java-spring-tutorial-the-only-tutorial-you-will-need-to-get-started-vs-code-13413e661db5)
