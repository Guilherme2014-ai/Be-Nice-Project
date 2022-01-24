import { UserEntity } from "../../src/entities/userEntity";
import { ComplimentEntity } from "../../src/entities/complimentEntity";
import { getRepository } from "typeorm";

let userId = 0;

describe("Create", () => {
  it("Should Create a User.", async () => {
    const randomNum = Math.trunc(Math.random() * 1000);
    const userInput = {
      name: `Guilherme ${randomNum}`,
      email: `guilhermehenrique${randomNum}@hotmail.com`,
      password_hash: `ssd${randomNum}`,
    };

    const _userRepository = getRepository(UserEntity);

    const user = _userRepository.create(userInput);
    await _userRepository.save(user);

    userId = Number(user.id);

    expect(user.email).toBe(userInput.email);
    expect(user.name).toBe(userInput.name);
  });

  it("Should Create a Compliment.", async () => {
    const complimentInput = {
      message: "Nota 10 !",
      user_receiver: userId as unknown,
    };

    const _complimentRepository = getRepository(ComplimentEntity);

    const compliment = _complimentRepository.create(complimentInput);
    await _complimentRepository.save(compliment);

    expect(compliment.message).toBe(complimentInput.message);
  });
});

describe("Query", () => {
  it("Should Return a user with it's Relation", async () => {
    const _userRepository = getRepository(UserEntity);
    const users = await _userRepository.find({
      select: ["name", "email"],
      relations: ["compliments_receiveds", "compliments_sents"],
    });

    expect(users.length).toBeGreaterThan(0);
  });
});
