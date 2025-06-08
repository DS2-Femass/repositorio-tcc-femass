# Análise das Funcionalidades do Backend

Esta seção descreve as funcionalidades implementadas no backend do sistema de gerenciamento de TCC, com base na análise do código-fonte localizado em `.../repositorio-tcc-femass/6 - CÓDIGO BACKEND/repositorio_tcc`.




## Funcionalidades Detalhadas

O backend do sistema oferece um conjunto robusto de funcionalidades para gerenciar todo o ciclo de vida dos Trabalhos de Conclusão de Curso (TCCs), desde o cadastro de usuários até a submissão e consulta dos trabalhos.

### Autenticação e Gerenciamento de Acesso

O sistema implementa um módulo de autenticação seguro e flexível. Os usuários podem realizar login utilizando seu email ou número de matrícula, juntamente com uma senha. O processo de autenticação é gerenciado pelo `AuthController` e `AuthService`, que validam as credenciais fornecidas. Em caso de sucesso, um token JWT (JSON Web Token) é gerado pelo `TokenService`, permitindo que o usuário acesse as rotas protegidas da aplicação. O sistema também contempla um fluxo de registro para novos usuários através do `AuthController`. Ao se registrar, o novo usuário recebe um email de boas-vindas contendo um link para definir sua senha inicial, garantindo a segurança desde o primeiro acesso. A funcionalidade de alteração de senha está disponível para usuários autenticados, permitindo que modifiquem suas credenciais diretamente pela interface. Além disso, um mecanismo de recuperação de senha foi implementado: usuários que esqueceram suas senhas podem solicitar um link de redefinição, que é enviado para o email cadastrado. Este link contém um token de uso único que permite ao usuário definir uma nova senha. O `AuthService` também gerencia a necessidade de alteração de senha, forçando o usuário a definir uma nova senha no primeiro login ou após uma redefinição. A segurança das senhas é garantida pelo uso de criptografia (BCryptPasswordEncoder).

### Gerenciamento de Entidades Principais

O backend permite o gerenciamento completo (CRUD - Create, Read, Update, Delete) de diversas entidades essenciais para o funcionamento do repositório de TCCs.

**Usuários:** O `UserController` e `UserService` são responsáveis pelo gerenciamento dos usuários do sistema. É possível buscar usuários específicos por seu identificador único (UUID), listar todos os usuários cadastrados (retornando informações essenciais para listagens), atualizar os dados de um usuário existente e remover usuários do sistema. As operações são protegidas e requerem permissões adequadas.

**Alunos:** De forma similar aos usuários, o `AlunoController` e `AlunoService` gerenciam os dados dos alunos. As operações incluem a busca por ID, listagem completa (com dados mínimos para performance), criação, atualização e exclusão de registros de alunos. Uma funcionalidade adicional importante é a importação em massa de alunos a partir de um arquivo Excel (.xlsx), facilitando o cadastro inicial ou a atualização de grandes volumes de dados.

**Orientadores:** O gerenciamento de orientadores segue o mesmo padrão CRUD, implementado no `OrientadorController` e `OrientadorService`. É possível realizar a busca por ID, listar todos os orientadores, criar novos registros, atualizar informações existentes e excluir orientadores.

**Categorias e Subcategorias:** Para organizar os TCCs, o sistema utiliza categorias e subcategorias. O `CategoriaController` e `SubcategoriaController`, juntamente com seus respectivos serviços, permitem a criação, leitura, atualização e exclusão dessas entidades. A listagem de subcategorias pode ser filtrada por categoria, facilitando a navegação e organização.

**Cursos:** O `CursoController` e `CursoService` oferecem a funcionalidade de listar todos os cursos disponíveis na instituição, informação relevante para associar alunos e TCCs aos seus respectivos cursos.

**TCCs:** O núcleo do sistema é o gerenciamento de TCCs, realizado pelo `TCCController` e `TCCService`. As funcionalidades incluem a busca de um TCC específico por ID, a listagem de todos os TCCs cadastrados (em formato resumido), a criação de novos registros de TCC, a atualização de informações de um TCC existente e a sua exclusão. Uma funcionalidade específica permite que o usuário autenticado visualize diretamente o seu próprio TCC ("Meu TCC").

### Serviços Auxiliares

**Envio de Emails:** O `MailService` é um componente crucial para a comunicação com o usuário, sendo responsável pelo envio de emails transacionais, como o email de boas-vindas no momento do registro e o email contendo o link para redefinição de senha.

Esta análise abrange as principais funcionalidades identificadas no código do backend. A próxima etapa consistirá em mapear a estrutura de arquivos e diretórios para fornecer uma visão organizacional do projeto.
