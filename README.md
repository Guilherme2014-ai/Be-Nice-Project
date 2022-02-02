<h1 align="center">
    <img src="https://trademarks.justia.com/media/image.php?serial=85790559" alt="Be Nice Logo"/>
</h1>
>>>>>>> 9f5fd3939484d1a572816e18279531700b675e1a

# Visão Geral
Vamos começar falando sobre oque a API faz. Bom, esta API pode criar Usuários que podem se relacionar entre sí, um exemplo dessa dinâmica é o próprio Facebook, onde Usuários
podem fazer amizade com outros Usuários, mas a API não possibilita somente isso, ela também permite que um Usuário possa fazer um comentário para outro - daí que vem o nome "Be Nice" - assim
gerando um sistema dinâmico de Network e Troca de Comentários entre os Usuários.

# Autenticação
A API tem 3 níveis de Autenticação nos quais são:
- Totalmente Livre | Publica
- Token Obrigatório
- Token e Confirmação de Email Obrigatório

O Token é Recebido após um login bem-sucedido, já a verificação de Email é feita sendo recebido um Email onde quando verificado retorna um novo Token.

# Como Funciona ?
Neste módulo sera discutido o funcionamento/lógica da API, tais como Sistema de Validação e Network entre Usuários.

## Verificação de Email
Quando um Usuário faz a autenticação através do Login é enviado um Email para o Email do Usuário, em que contem um botão chamado "Confirmar", este botão redireciona para uma rota chamada "/users/email/verification/:email/:secret", no botão há duas informações chaves, o Email do Usuário, e uma "secret", no qual o email sera utilizado para achar o dado no banco de dados no qual contem a informação que diz se o Email em questão já foi Confirmado.
Para que a validação ocorra com sucesso é crucial que o Email e a "secret" estejam certos, pois caso a "secret" estiver errada, quando o service for comparar a "secret" recebida com a "secret" salva no banco de dados não haverá um Match, assim fazendo a rota retornar um erro.
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
A Função desta Rota é devolver um Token de Autenticação como Resposta caso as Regras de Negócios sejam compridas.

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

## GET - /users/friends/resquests
A Função desta Rota é Permitir o Usuário ver quais requisições ele Recebeu.

### Regras de Negócios:
- Não é possível ver as solicitações caso não estiver loggado :/

#### Input Example
- Sem Input

### Respostas
- Caso a Solicitação já tenha sido enviada: { message: *Todas as Solicitações, status: 406 }

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
- Caso a Solicitação já tenha sido enviada: { message: "Invite Already Sent !", status: 406 }

- Caso o Usuário destinatário não exita: { message: "User Not Found !", status: 404 }

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
A Função desta Rota é retornar os Comentários recebidos por outros Usuários

### Regras de Negócios:
- Necessita estar logado
- O Usuário necessita existir.
- Não é permitido um Usuário ver os comentários recebidos por outros Usuários que não sejam amigos dele.

#### Input Example
- Sem Input

### Respostas
- Em Caso de Sucesso: { *lista de comentarios, status: 200 }

- Caso o Usuário não existir: { message: "User not found !", status: 404 }

- Caso o usuário não esteja na lista de amigos: { message: "This User is not your friend :/", status: 401 }

- Caso não tenha Token: { token: "Token Required !", status: 401 }

- Caso o Email não foi verificado: { token: "Email Verification Required !", status: 401 }







## POST - /users/email/verification/:email/:secret
A Função desta Rota é verificar o Email.

### Regras de Negócios:
- O Usuário Email enviado precisa existir na Base de Dados.
- A Secret enviada deve ser a mesma salva no Email gravado no Banco de Dados.

#### Input Example
- Sem Input

### Respostas
- Em Caso de Sucesso: { *New Token, status: 200 }

- Caso o Email não existir: { message: "Non-Registred Email !", status: 404 }

- Caso a Secret for diferente da Salva: { message: "Unathorized !", status: 401 }

- Caso o Email já foi ativado: { token: "Already Activated !", status: 401 }
