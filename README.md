# Visão Geral
Vamos começar falando sobre oque a API faz. Bom, esta API pode criar Usuários que podem se relacionar entre sí, um exemplo dessa dinâmica é o própio Facebook, onde Usuários
podem fazer amizade com outros Usuários, mas a API não possibilita somente isso, ela tambem permite que um Usuário possa fazer um comentario para outro - daí que vem o nome "Be Nice" - assim
gerando um sistema dinâmico de Network e Troca de Comentarios entre os Usuários.

# Autenticação
A API tem 3 níveis de Autenticação nos quais são:
- Totalmente Livre | Publica
- Token Obrigatório
- Token e Confirmação de Email Obrigatório

O Token é Recebido após um login bem sucedido, já a verificação de email é feita sendo recebido um email no qual quando verificado retorna um novo Token.

# Como Funciona ?
Neste módulo sera descutido o funcionamento/lógica da API, tais como sistema de validação e network entre Usuários.

## Verificação de Email
Quando um Usuário faz a autenticação através do Login é enviado um email para o email do Usuário, no qual contem um botão chamado "Confirmar", este botão redireciona para uma rota chamada "/users/email/verification/:email/:secret", no botão há duas informações chaves, o email do usuario, e uma "secret", no qual o email sera utilizado para achar o dado no banco de dados no qual contem a informação que diz se o email em questão já foi Confirmado.
Para que a validação de certo é crucial que o email e a "secret" estejam certo, pois caso a "secret" estiver errada, quando o service for comparar a "secret" recebida com a "secret" salva no banco de dados não havera um Match, assim fazendo a rota retornar um erro.
OBS: As LIB's utilizadas nesse sistema de autenticação foram Nodemailer como Email transporter e Bull como Background Job.

## Network entre Usuários
O Sistema de Network funciona semelhante ao sistema de Network do facebook, a solicitação é enviada e só se torna uma amizade real quando tal solicitação é aceita pelo destinatário, a rota em que se manda solicitações: "/users/friends/resquests/send/:user_email", rota que aceita solicitações: "/users/friends/resquests/accept/:user_sender_email_friend_request", assim que a solicitação é enviada já é possivel o outro usuário aceitar tal solicitação, assim criando uma nova network no banco de dados


# Rotas

## POST - /users/create
A Função desta Rota é Registrar um novo Usuário na Base de Dados.

### Regras de Negócios:
- "name", "email" e "password" são obrigatórios aqui.
- Não é Possível Registrar um novo Usuário com um Email que já exista na Base de Dados.
#### Input Example
{ name: "ex.name", email: "ex.email", password: "ex.password" }

### Respostas
- Caso algum Campo não for Preenchido: { message: "Some Field wasn't Filled !", status: 400 }

- Caso o Email já existir na Base de Dados: { message: "Email Already Registred !", status: 406 }

- Sucesso na Requisição: { "email": " 'Email Cadastrado' ", "name": " 'Nome Cadastrado' ", "status": 200 }

<hr>

## POST - /users/login
A Função desta Rota é devolver um Token de Authenticação como Resposta caso as Regras de Negócios sejam compridas.

### Regras de Negócios:
- Campos "email" e "password" são obrigatórios aqui.
- O Usuário com o Email informado precisa existir na Base de Dados.
- A Senha informada precisar ser a mesma do Usuário cadastrado na Base de Dados.

#### Input Example
{ email: "ex.email", password: "ex.password" }

### Respostas
- Caso o Email informado não existir na Base de Dados: { message: "Non-existent User !", status: 404 }

- Caso a Senha não for igual a Senha do Usuário Responsável pelo Email informado: { message: "Wrong Password !", 401 }

- Sucesso na Requisição: { token: "Ex.Token", status: 200 }

<hr>

## POST - /users/friends/resquests
A Função desta Rota é Permitir o Usuário ver quais requisições ele Recebeu.

### Regras de Negócios:
- Não é possível ver as solicitações caso não estiver loggado :/

#### Input Example
- Sem Input

### Respostas
- Caso o a Solicitação já tenha sido enviada: { message: *Todas as Solicitações, status: 406 }

- Caso não tenha Token: { token: "Token Required !", status: 401 }

<hr>

## POST - /users/friends/resquests/send/:user_email
A Função desta Rota é enviar uma Solicitação para algum usuário.

### Regras de Negócios:
- Não é permitido mandar mais de uma solicitação para o mesmo Usuário.
- Não é possível mandar solicitação para um Usuário que não exita.
- Não é possível mandar uma solicitação sem ter um Token Valido.
- Não é possível mandar uma solicitação sem ter o Email Verificado.

#### Input Example
- Sem Input

### Respostas
- Caso o a Solicitação já tenha sido enviada: { message: "Invite Already Sent !", status: 406 }

- Caso o Usuário destinatario não exita: { message: "User Not Found !", status: 404 }

- Caso não tenha Token: { token: "Token Required !", status: 401 }

- Caso o Email não foi verificado: { token: "Email Verification Required !", status: 401 }

<hr>

## POST - /users/friends/resquests/accept/:user_sender_email_friend_request
A Função desta Rota é aceitar solicitações.

### Regras de Negócios:
- Não é possível aceitar solicitações caso não estiver loggado :/

#### Input Example
- Sem Input

### Respostas
- Em Caso de Sucesso: 

- Caso o Usuário ou a solicitação não exita: { message: "User Not Found ! || Request not Found !", status: 404 }

- Caso não tenha Token: { token: "Token Required !", status: 401 }

<hr>

## POST - /users/search/name/:userName
A Função desta Rota é retornar todos os usuários com o Nome recebido por parâmetro.

### Regras de Negócios:
- Não é possível aceitar solicitações caso não estiver loggado :/

#### Input Example
- Sem Input

### Respostas
- Em Caso de Sucesso: { *lista de usuários, status: 200 }

- Caso não tenha Token: { token: "Token Required !", status: 401 }

<hr>

## POST - /users/compliments/create/:user_receiver
A Função desta Rota é Criar um novo comentario

### Regras de Negócios:
- Não é possível aceitar solicitações caso não estiver loggado :/
- Não é possível fazer um comentario para sí própio.
- O Usuário destinatario deve existir.
- O Campo "mensagem" é obrigatório.

#### Input Example
- Sem Input

### Respostas
- Em Caso de Sucesso: { *lista de usuários, status: 200 }

- Caso o Usuário não exista: { token: "User not found !", status: 404 }

- Em Caso de campos faltando: { "Some field wasn't filled !", status: 400 }

- Caso não tenha Token: { token: "Token Required !", status: 401 }

<hr>

## POST - /users/compliments/:user_email
A Função desta Rota é Criar um novo comentario

### Regras de Negócios:
- Não é possível aceitar solicitações caso não estiver loggado :/
- O Campo "mensagem" é obrigatório.

#### Input Example
- Sem Input

### Respostas
- Em Caso de Sucesso: { *lista de usuários, status: 200 }

- Em Caso de campos faltando: { "Some field wasn't filled !", status: 400 }

- Caso não tenha Token: { token: "Token Required !", status: 401 }