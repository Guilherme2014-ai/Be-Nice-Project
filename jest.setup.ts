jest.mock("bull");

import { server } from "./src/server";
import database from "./src/database";
import promiseTest from "./__tests__/utils/promiseTest";
import { mockedFuncBase } from "./__tests__/mocks/baseMockedFunc";
import { queueMockednstancee } from "./__tests__/mocks/queueMockedInstance";

beforeAll(async () => {
  // Funcionamento: Pré-Programado
  // Funcionamento: "mock.instances" funcionando Corretamente.

  const addFuncMocked =
    queueMockednstancee.add as unknown as jest.MockedFunction<mockedFuncBase>; // Modificando o Tipo da função

  addFuncMocked.mockResolvedValueOnce("First Mocked !");
  addFuncMocked.mockResolvedValue("Second Mocked !");

  // Others...
  await promiseTest(); // hahahahha
  await database.Connection();
});

afterAll(async () => {
  await database.Clean();

  await database.Close();
  server.close();
});
