## Escalabilidade
No Cenário em que fui exposto a cada novo Job era necessário criar uma nova instancia "Queue", na qual recebia como Parâmetro o nome do novo Job, esta instancia da fila não vinha com o método já incluso, precisava-se de inserir tal método através do comando Process, feito isso a Fila estava criada e pronta para ser chamada e usada. Exem.:

```
const someQueue = new Queue(queueName);
someQueue.process(queueMethod);
```

O problema dessa situação é que isto ficaria muito cansativo de Repetir a cada job, em uma aplicação que teria 10 Jobs por exemplo, o código viraria uma massaroca. Dado isso é visto que a Escalabilidade não deve ser vista como uma Opção mas sim como uma Obrigação em certos casos se bem implementada.

## Implementação do EJS e Desacoplagem na Vida Real
Conforme se aprofunda na Programação ou em Tecnologias, é visto que muitas coisas são, na verdade, implementações, não dependências — começarei a usar termos técnicos em situações reais — como visto neste Projeto.  A causa desse pensamento veio quando utilizei o render "EJS", antes eu pensava que o EJS só servia como um render, e se limitava a encaixar no render do express, porem, ele está longe disso! Uma coisa que estou aprendendo a fazer e ver como as coisas realmente funcionam, no caso do EJS falando a grosso modo ele tem a funcionalidade de transformar um arquivo ".ejs" em string, assim o express podendo tirar proveito disso assim como qualquer outra coisa ou o própio programador em outra ocasião. Isto deixa bem claro como devo melhorar muito meu jeito de pensar, este projeto meu ensinou muitas coisas, entre elas o jeito desacoplado em que as coisas funcionam.

## Testes e o Poder do Mocking
Neste projeto eu utilizei o jest juntamente com o supertest para poder testa-lo, e o que eu pude perceber foi que o teste não se resume em apenas testar, ele vai muito além disso caso o programador realmente queira fazer algo bem feito e válido, caso o projeto tenha uma complexidade um pouco elevada, o modulo de testes deverá estar preparado a altura. Um exemplo disso foi a própria situação que eu enfrentei, no qual eu tinha 3 tipos diferentes de rotas, uma em que o acesso era livre, outra em que necessitava de estar logado e outra em que precisava estar logado e com o email verificado, agora pense como eu poderia fazer para que o mesmo User passasse por todas as rotas? impossível! pois, cada rota tem exigências diferentes, e é aí em que o modulo de testes precisa ter um planejamento prévio, no caso contrario, ele dará muito mais dor de cabeça do que o própio código. Minha solução para isso foi não criar um objeto de User, mas sim uma Classe de Usuários onde tinha 2 propriedades e 2 Métodos: LoggedToken(propriedade) LoggedAndVerifiedEmailToken(propriedade)

SetLoggedToken(Método) SetLoggedAndVerifiedEmailToken(Método)

Cada um dos métodos eram chamados de acordo com seus deveres, no "it" em que testava o login era chamado o método "SetLoggedToken", assim setando o token recebido do login, e no "it" em que testava a validação de email era chamado o método "SetLoggedAndVerifiedEmailToken", assim setando o "SetLoggedAndVerifiedEmailToken" com um token com o email verificado :)

Visto isso podemos usar o mesmo User, porem diferentes tipos de token em diferentes rotas, assim fazendo o teste funcionar Perfeitamente!

O Mocking do jest se mostrou muito útil em uma situação em que a rota testada chamava uma fila — no qual era totalmente inutil em um teste visto que só gastaria recursos da máquina :/ — para resolver este problema foi preciso mockar uma Classe inteira, para assim mockar seus métodos, o método em questão era o "add", método responsável por chamar filas. Enquanto eu "Mockava" o método pensei em um possível erro! Quando se mocka uma Classe no Jest é dado um array de instâncias para que assim seja possível escolher qual método de qual instacia se precisa mockar, porem como eu iria escolher uma instância se ela ainda não foi ao menos nem criada? neste momento passou pela minha cabeça que poderia ser um sistema pré programado como o "mockResolvedValueOnce" por exemplo, e Bingo! Era exatamente isso !

NeverStopLearning !
