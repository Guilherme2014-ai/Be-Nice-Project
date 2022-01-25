export default interface IUserPayload {
  sub: string;
  email: string;
  name: string;
  verifiedEmail: boolean;
  expiresIn: string;
}
