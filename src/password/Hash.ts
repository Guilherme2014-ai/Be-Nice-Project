import { hash, genSalt, compare } from "bcrypt";

class Hasher {
  constructor(private password: string) {}

  async Hash(): Promise<string> {
    const salts = await genSalt(10);

    return await hash(this.password, salts);
  }

  async Compare(encrypted): Promise<boolean> {
    return await compare(this.password, encrypted);
  }
}

export default Hasher;
