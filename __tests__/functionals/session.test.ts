import app from "../../src/app";
import supertest from "supertest";
import userTest from "../mocks/users/userTest";
import userComplimentsTests from "../mocks/users/userComplimentsTests";
import { getRepository } from "typeorm";
import { emailValidationEntity } from "../../src/entities/emailValidationEntity";
const request = supertest(app);

describe("User Routes", () => {
  describe("POST -> /users/create", () => {
    it("Should Receive status 200.", async () => {
      const response = await request
        .post("/users/create")
        .send(userTest.RegisterUserInput);

      const response01 = await request
        .post("/users/create")
        .send(userComplimentsTests.RegisterUserInput);

      expect(response.status).toBe(200);
      expect(response01.status).toBe(200);
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

      const token01 = response01.body["token"];

      userTest.SetToken(token01);
      userTest.SetNoVerifiedEmailToken(token01);

      expect(response01.status).toBe(200);
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

  describe("GET -> /users/email/verification/:email/:secret", () => {
    it("Should Return status 200 with a new Token.", async () => {
      const emailValidationRepository = getRepository(emailValidationEntity);

      const { secret: userTestSecret } =
        await emailValidationRepository.findOne(
          {
            email: userTest.email,
          },
          {
            select: ["secret"],
          },
        );

      const { secret: userComplimentsSecret } =
        await emailValidationRepository.findOne(
          {
            email: userComplimentsTests.email,
          },
          {
            select: ["secret"],
          },
        );

      const response01 = await request.get(
        `/users/email/verification/${userTest.email}/${userTestSecret}`,
      );
      const response02 = await request.get(
        `/users/email/verification/${userComplimentsTests.email}/${userComplimentsSecret}`,
      );

      userTest.SetEmailValidationSecret(userTestSecret);
      userComplimentsTests.SetEmailValidationSecret(userComplimentsSecret);

      const newToken01 = response01.body["new_token"];
      const newToken02 = response02.body["new_token"];

      userTest.SetToken(newToken01);
      userComplimentsTests.SetToken(newToken02);

      expect(newToken01).toBeTruthy();
      expect(newToken02).toBeTruthy();

      expect(response01.status).toBe(200);
      expect(response02.status).toBe(200);
    });

    it("Should Return status 401.", async () => {
      const response = await request.get(
        `/users/email/verification/${userTest.email}/__invalid__`,
      );

      expect(response.status).toBe(401);
    });
  });

  //--------------------------------------------------------------------------------

  describe("POST -> /users/friends/resquests/send/:user_email", () => {
    it("Should return status 200", async () => {
      const response = await request
        .post(`/users/friends/resquests/send/${userComplimentsTests.email}`)
        .set("Authorization", `${userTest.GetToken}`);

      expect(response.status).toBe(200);
    });

    it("Should return status 406 when the invite was already sent", async () => {
      const response = await request
        .post(`/users/friends/resquests/send/${userComplimentsTests.email}`)
        .set("Authorization", `${userTest.GetToken}`);

      expect(response.status).toBe(406);
    });

    // it("Should return status 406 when the the user already is your friend", () => {});

    it("Should return status 404", async () => {
      const response = await request
        .post(`/users/friends/resquests/send/non-existentUser@exem.com`)
        .set("Authorization", `${userTest.GetToken}`);

      expect(response.status).toBe(404);
    });

    it("Should return status 401 when token not Provided.", async () => {
      const response = await request.post(
        `/users/friends/resquests/send/${userComplimentsTests.email}`,
      );

      expect(response.body["Error"]).toBe("Token Required !");
      expect(response.status).toBe(401);
    });

    it("Should return status 401 when email is not Verified.", async () => {
      const response = await request
        .post(`/users/friends/resquests/send/${userComplimentsTests.email}`)
        .set("Authorization", `${userTest.GetNoVerifiedEmailToken}`);

      expect(response.body["Error"]).toBe("Email Verification Required !");
      expect(response.status).toBe(401);
    });
  }); // Mandar Request

  // A partir da aceitação do Friend Request que sera feita a Amizade entre os Usuários
  describe("GET -> /users/friends/resquests", () => {
    it("Should return status 200", async () => {
      const response = await request
        .get(`/users/friends/resquests`)
        .set("Authorization", userTest.GetToken);

      expect(response.status).toBe(200);
    });

    it("Should return status 401 when token not Provided.", async () => {
      const response = await request.get(`/users/friends/resquests`);

      expect(response.body["Error"]).toBe("Token Required !");
      expect(response.status).toBe(401);
    });
  }); // Ver seus Própios Requests

  describe("POST -> /users/friends/resquests/accept/:user_sender_email_friend_request", () => {
    it("Should return status 200", async () => {
      const response = await request
        .post(`/users/friends/resquests/accept/${userTest.email}`)
        .set("Authorization", userComplimentsTests.GetToken);

      expect(response.status).toBe(200);
    });

    it("Should return status 404", async () => {
      const response = await request
        .post("/users/friends/resquests/accept/non-existent-email")
        .set("Authorization", `${userComplimentsTests.GetToken}`);

      expect(response.status).toBe(404);
    });

    it("Should return status 401", async () => {
      const response = await request.post(
        `/users/friends/resquests/accept/${userTest.email}`,
      );

      expect(response.status).toBe(401);
    });
  }); // A fazer...

  //--------------------------------------------------------------------------------

  describe(`GET -> "/users/search/name/:userName`, () => {
    // Sem Resposta de sucesso
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
});

describe("Compliments Routes", () => {
  describe("POST -> /users/compliments/create/:user_receiver", () => {
    it("Should Return status 200.", async () => {
      const response = await request
        .post(`/users/compliments/create/${userComplimentsTests.email}`)
        .send({
          message: "Random Compliment",
        })
        .set("Authorization", `${userTest.GetToken}`);

      expect(response.status).toBe(200);
    });

    it("Should Return status 400.", async () => {
      const response = await request
        .post(`/users/compliments/create/${userComplimentsTests.email}`)
        .set("Authorization", `${userTest.GetToken}`);

      expect(response.status).toBe(200);
    });

    it("Should Return status 404.", async () => {
      const response = await request
        .post("/users/compliments/create/non_existentUser@exem.com")
        .send({
          message: "Random Compliment",
        })
        .set("Authorization", `${userTest.GetToken}`);

      expect(response.status).toBe(404);
    });

    it("Should Return status 406.", async () => {
      const response = await request
        .post(`/users/compliments/create/${userTest.email}`)
        .send({
          message: "Random Compliment",
        })
        .set("Authorization", `${userTest.GetToken}`);

      expect(response.status).toBe(406);
    });
  });

  describe("GET -> /users/compliments/:user_email", () => {
    it("Should return status 200.", async () => {
      const response = await request
        .get(`/users/compliments/${userComplimentsTests.email}`)
        .set("Authorization", `${userTest.GetToken}`);

      expect(response.status).toBe(200);
    });

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

    it("Should return status 401 when email is not Verified.", async () => {
      const response = await request
        .get(`/users/compliments/${userComplimentsTests.email}`)
        .set("Authorization", `${userTest.GetNoVerifiedEmailToken}`);

      expect(response.body["Error"]).toBe("Email Verification Required !");
      expect(response.status).toBe(401);
    });
  }); // Retornará todos os compliments feitos por este usuário, caso ele não esteja na sua lista de amigos ou não for voce mesmo, nao sera possivel ver os compliments do usuário
  // Mutations...
  // /compliments/:user_email/:compliment_id...
});
