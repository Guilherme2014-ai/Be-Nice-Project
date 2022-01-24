import { Connection, ConnectionManager, createConnection } from "typeorm";
import databaseConfig from "../config/databaseConfig";

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
}

export default new database();
