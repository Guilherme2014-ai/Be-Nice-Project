import { server } from "./src/server";
import database from "./src/database";

beforeAll(async () => {
  await database.Connection();
});

afterAll(async () => {
  await database.Close();
  server.close();
});
