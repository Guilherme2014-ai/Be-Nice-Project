import { resolve } from "path";
import { config } from "dotenv";
import IDotEnv from "../interfaces/IDotEnv";

config({ path: resolve(__dirname, "..", "..", ".env") });

const { REDIS_HOST, REDIS_PORT } = process.env as unknown as IDotEnv;

export default {
  port: REDIS_PORT,
  host: REDIS_HOST,
};
