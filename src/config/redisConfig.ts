import IDotEnv from "../interfaces/IDotEnv";

const { REDIS_HOST, REDIS_PORT } = process.env as unknown as IDotEnv;

export default {
  port: REDIS_PORT,
  host: REDIS_HOST,
};
