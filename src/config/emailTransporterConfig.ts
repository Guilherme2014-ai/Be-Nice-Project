import { resolve } from "path";
import { config } from "dotenv";
import IDotEnv from "../interfaces/IDotEnv";

config({ path: resolve(__dirname, "..", "..", ".env") });

const {
  TRANSPORTER_EMAIL_HOST,
  TRANSPORTER_EMAIL_PORT,
  TRANSPORTER_EMAIL_USER,
  TRANSPORTER_EMAIL_PASS,
} = process.env as unknown as IDotEnv;

export default {
  host: TRANSPORTER_EMAIL_HOST,
  port: TRANSPORTER_EMAIL_PORT,
  secure: false,
  auth: {
    user: TRANSPORTER_EMAIL_USER,
    pass: TRANSPORTER_EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
};
