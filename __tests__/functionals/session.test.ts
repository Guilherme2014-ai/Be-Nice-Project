import app from "../../src/app";
import supertest from "supertest";
import userTest from "../mocks/users/userTest";
import { userComplimentsTests } from "./models.test";
import { getRepository } from "typeorm";
import { emailValidationEntity } from "../../src/entities/emailValidationEntity";
const request = supertest(app);

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
      const response01 = await request
        .post("/users/login")
        .send(userTest.LoginUserInput);
      /*
      const response02 = await request
        .post("/users/login")
        .send(userComplimentsTests.LoginUserInput);
        */

      const token01 = response01.body["token"];
      // const token02 = response02.body["token"];

      userTest.SetToken(token01);
      //userTest.SetToken(token02);

      expect(response01.status).toBe(200);
      // expect(response02.status).toBe(200);
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

  describe(`GET -> "/users/search/name/:userName`, () => {
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
  describe("GET -> /users/email/verification/:email/:secret", () => {
    it("Should Return status 200 with a new Token.", async () => {
      const { secret } = await getRepository(emailValidationEntity).findOne(
        {
          email: userTest.email,
        },
        {
          select: ["secret"],
        },
      );
      const response = await request.get(
        `/users/email/verification/${userTest.email}/${secret}`,
      );
      userTest.SetEmailValidationSecret(secret);

      const newToken = response.body["new_token"];

      userTest.SetToken(newToken);

      expect(newToken).toBeTruthy();
      expect(response.status).toBe(200);
    });

    it("Should Return status 401.", async () => {
      const response = await request.get(
        `/users/email/verification/${userTest.email}/__invalid__`,
      );

      expect(response.status).toBe(401);
    });
  });
});

describe("Compliments Routes", () => {
  describe("GET -> /users/compliments/:user_email", () => {
    /*  it("Should return status 200.", async () => {
      const response = await request
        .get(`/users/compliments/${userComplimentsTests.email}`)
        .set("Authorization", `${userTest.GetToken}`);

      expect(response.status).toBe(200);
    });
*/
    it("Should return status 404.", async () => {
      const response = await request
        .get("/users/compliments/non_existentEmail@gmail.com")
        .set("Authorization", `${userTest.GetToken}`);

      expect(response.status).toBe(404);
    });

    it("Should return status 401 when token not Provided.", async () => {
      const response = await request.get(
        `/users/compliments/${userComplimentsTests.email}`,
      );

      expect(response.body["Error"]).toBe("Token Required !");
      expect(response.status).toBe(401);
    });

    it("Should return status 401 when the user passed is not your friend.", async () => {
      const response = await request
        .get(`/users/compliments/${userComplimentsTests.email}`)
        .set("Authorization", `${userTest.GetToken}`);

      expect(response.body["Error"]).toBe("This User is not your friend :/");
      expect(response.status).toBe(401);
    });
  }); // Retornará todos os compliments feitos por este usuário, caso ele não esteja na sua lista de amigos ou não for voce mesmo, nao sera possivel ver os compliments do usuário

  describe("POST -> /users/compliments/create ", () => {
    it("Should Return status 200.", async () => {
      const response = await request
        .post("/users/compliments/create")
        .send({
          message: "Random Compliment",
          user_receiver: userComplimentsTests.email,
        })
        .set("Authorization", `${userTest.GetToken}`);

      expect(response.status).toBe(200);
    });

    it("Should Return status 400.", async () => {
      const response = await request
        .post("/users/compliments/create")
        .send({
          user_receiver: userComplimentsTests.email,
        })
        .set("Authorization", `${userTest.GetToken}`);

      expect(response.status).toBe(200);
    });

    it("Should Return status 404.", async () => {
      const response = await request
        .post("/users/compliments/create")
        .send({
          message: "Random Compliment",
          user_receiver: `${userComplimentsTests.email}asdsdsd`,
        })
        .set("Authorization", `${userTest.GetToken}`);

      expect(response.status).toBe(404);
    });

    it("Should Return status 406.", async () => {
      const response = await request
        .post("/users/compliments/create")
        .send({
          message: "Random Compliment",
          user_receiver: userTest.email,
        })
        .set("Authorization", `${userTest.GetToken}`);

      expect(response.status).toBe(406);
    });
  });
  // Mutations...
  // /compliments/:user_email/:compliment_id...
});
