import IUserCreateRequest from "../../src/interfaces/IUserCreateRequest";
import IUserLoginRequest from "../../src/interfaces/IUserLoginRequest";

export default class newUserInput implements IUserCreateRequest {
  private token: string;
  private emailValidationSecret: string;
  private noVerifiedEmailToken: string;

  constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}

  get RegisterUserInput(): IUserCreateRequest {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
    };
  }

  get LoginUserInput(): IUserLoginRequest {
    return {
      email: this.email,
      password: this.password,
    };
  }

  SetToken(tokenReceived): void {
    this.token = tokenReceived;
  }

  SetEmailValidationSecret(secretReceived): void {
    this.emailValidationSecret = secretReceived;
  }

  SetNoVerifiedEmailToken(noVerifiedEmailToken): void {
    this.noVerifiedEmailToken = noVerifiedEmailToken;
  }

  get GetToken(): string | null {
    const token = this.token;
    return token ? token : null;
  }

  get GetEmailValidation(): string | null {
    const secret = this.emailValidationSecret;
    return secret ? secret : null;
  }

  get GetNoVerifiedEmailToken(): string | null {
    const token = this.noVerifiedEmailToken;
    return token ? token : null;
  }
}
