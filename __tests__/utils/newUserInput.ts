import IUserCreateRequest from "../../src/interfaces/IUserCreateRequest";

export default class newUserInput implements IUserCreateRequest {
  private token: string;

  constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}

  get RegisterUserInput() {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
    };
  }

  get LoginUserInput() {
    return {
      email: this.email,
      password: this.password,
    };
  }

  SetToken(tokenReceived) {
    this.token = tokenReceived;
  }

  get GetToken() {
    const token = this.token;
    return token ? token : null;
  }
}
