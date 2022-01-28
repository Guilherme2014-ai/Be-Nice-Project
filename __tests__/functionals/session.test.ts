import app from "../../src/app";
import supertest from "supertest";
import IUserCreateRequest from "../../src/interfaces/IUserCreateRequest";
import newUserInput from "../utils/newUserInput";

const request = supertest(app);

const randomIntNum = () => Math.trunc(Math.random() * 1000);
const userInputGenerator = (): IUserCreateRequest => ({
  name: `Guilherme ${randomIntNum()}`,
  email: `guigui${randomIntNum()}@gmail.com`,
  password: `${randomIntNum()}${randomIntNum()}`,
});

//------------------------------------------------------------

const { name, email, password } = userInputGenerator();
const userTest = new newUserInput(name, email, password);

describe("User Routes", () => {
  describe("POST -> /users/create", () => {
    it("Should Receive status 200.", async () => {
      const response = await request
        .post("/users/create")
        .send(userTest.RegisterUserInput);

      expect(response.status).toBe(200);
    });

    it("Should Receive status 400.", async () => {
      const response = await request
        .post("/users/create")
        .send({ email: userTest.LoginUserInput.email });

      expect(response.status).toBe(400);
    });

    it("Should Receive status 406.", async () => {
      const response = await request
        .post("/users/create")
        .send(userTest.RegisterUserInput);

      expect(response.status).toBe(406);
    });
  });

  describe("POST -> /users/login", () => {
    it("Should Receive status 200.", async () => {
      const response = await request
        .post("/users/login")
        .send(userTest.LoginUserInput);

      const token = response.body["token"];
      userTest.SetToken(token);

      expect(response.status).toBe(200);
    });

    it("Should Receive status 400.", async () => {
      const response = await request
        .post("/users/login")
        .send({ email: userTest.LoginUserInput.email });

      expect(response.status).toBe(400);
    });

    it("Should Receive status 404.", async () => {
      const response = await request.post("/users/login").send({
        email: `${userTest.LoginUserInput.email}_ITDOESNOTEXISTS!`,
        password: userTest.LoginUserInput.password,
      });

      expect(response.status).toBe(404);
    });

    it("Should Receive status 401.", async () => {
      const response = await request.post("/users/login").send({
        email: userTest.LoginUserInput.email,
        password: `${userTest.password}FAKE_555`,
      });

      expect(response.status).toBe(401);
    });
  });

  describe(`GET -> "/users/sourch/name/:userName`, () => {
    it("Should Return status 401.", async () => {
      const response = await request.get(
        `/users/search/name/${userTest.RegisterUserInput.name}`,
      );

      expect(response.status).toBe(401);
    });

    it("Should Return status 200.", async () => {
      const token = userTest.GetToken;

      const response = await request
        .get(`/users/search/name/${userTest.RegisterUserInput.name}`)
        .set("Authorization", `${token}`);

      expect(response.status).toBe(200);
    });
  });
  /* Necessita de Pass
  describe("GET -> /users/email/verification/:email/:secret", () => {
    it("Should Return status 200.", async () => {
      const token = userTest.GetToken;

      const response = await request
        .get("/users/email/verification")
        .set("Authorization", `${token}`);

      expect(response.body["new_token"]).toBeTruthy();
      expect(response.status).toBe(200);
    });
  });*/
});

/*


describe("Compliments Routes", () => {
  describe("GET -> /compliments/:user_email", () => {
    it("Should return status 404.", async () => {
      const response = await request.get(
        "/compliments/non_existentEmail@gmail.com",
      );

      expect(response.status).toBe(400);
    });

    it("Should return status 401.", async () => {
      const response = await request
        .get(`/compliments/${userInput01.email}`)
        .send({
          Headers: {
            Authentication: tokenTest,
          },
        }); // Ponto de Atenção

      expect(response.status).toBe(401);
    });
  }); // Retornará todos os compliments feitos por este usuário, caso ele não esteja na sua lista de amigos ou não for voce mesmo, nao sera possivel ver os compliments do usuário
  describe("POST -> /compliments/create ", () => {
    it("Should Return status 200.", async () => {
      const response = await request.post("/compliments/create").send({
        message: "Random Compliment",
        user_sender: userInput01.email,
        user_receiver: userInput02.email,
      });

      expect(response.status).toBe(200);
    });

    it("Should Return status 400.", async () => {
      const response = await request.post("/compliments/create").send({
        user_receiver: userInput02.email,
      });

      expect(response.status).toBe(400);
    });

    it("Should Return status 404.", async () => {
      const response = await request.post("/compliments/create").send({
        message: "Random Compliment",
        user_sender: userInput01.email,
        user_receiver: `${userInput02.email}asdsdsd`,
      });

      expect(response.status).toBe(404);
    });
  });
  // Mutations...
  // /compliments/:user_email/:compliment_id...
});

*/
