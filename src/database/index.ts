import {
  Connection,
  ConnectionManager,
  createConnection,
  getRepository,
} from "typeorm";
import entities from "../entities";
import databaseConfig from "../config/databaseConfig";
import { UserEntity } from "../entities/userEntity";

class database {
  async Connection(): Promise<Connection> {
    const node_env = process.env.NODE_ENV;
    const env = !node_env ? "pruduction" : node_env;

    return await createConnection({
      type: "mysql",
      ...databaseConfig[`${env}`],
    });
  }

  async Close(): Promise<void> {
    await Promise.all(
      new ConnectionManager().connections.map((connection) =>
        connection.close(),
      ),
    );
  }

  async Clean() {
    await Promise.all(
      entities.map((entity) => {
        return getRepository(entity).delete({});
      }),
    );
  }
}

export default new database();
