import { UserEntity } from "../../src/entities/userEntity";
import { ComplimentEntity } from "../../src/entities/complimentEntity";
import { getRepository } from "typeorm";
import userComplimentsTests from "../mocks/users/userComplimentsTests";

const randomNum = Math.trunc(Math.random() * 1000);
const userInput = {
  name: `Guilherme ${randomNum} MODEL`,
  email: `guilhermehenrique${randomNum}@hotmail.com`,
  password_hash: `ssd${randomNum}`,
};

describe("Create", () => {
  it("Should Create a User.", async () => {
    const _userRepository = getRepository(UserEntity);

    const user = _userRepository.create(userInput);
    const userCompliment = _userRepository.create({
      name: userComplimentsTests.name,
      email: userComplimentsTests.email,
      password_hash: userComplimentsTests.password,
    });

    await _userRepository.save(user);
    await _userRepository.save(userCompliment);

    expect(userCompliment.email).toBe(userComplimentsTests.email);
    expect(userCompliment.name).toBe(userComplimentsTests.name);

    expect(user.email).toBe(userInput.email);
    expect(user.name).toBe(userInput.name);
  });

  it("Should Create a Compliment.", async () => {
    const complimentInput = {
      message: "Nota 10 !",
      user_receiver: userComplimentsTests.email,
      user_sender: userInput.email,
    };

    const _complimentRepository = getRepository(ComplimentEntity);

    const compliment = _complimentRepository.create({
      message: complimentInput.message,
      user_receiver: complimentInput.user_receiver as unknown as UserEntity,
      user_sender: complimentInput.user_sender as unknown as UserEntity,
    });
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

export { userComplimentsTests };
