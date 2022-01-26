export default interface IDotEnv {
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;

  JWT_PASS: string;

  TRANSPORTER_EMAIL_HOST: string;
  TRANSPORTER_EMAIL_PORT: number;
  TRANSPORTER_EMAIL_USER: string;
  TRANSPORTER_EMAIL_PASS: string;

  REDIS_PORT: number;
  REDIS_HOST: string;
}
