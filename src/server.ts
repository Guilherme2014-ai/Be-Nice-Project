import "reflect-metadata";
import "express-async-errors";
import { resolve } from "path";
import { config } from "dotenv";
import app from "./app";
import database from "./database";

config({ path: resolve(__dirname, "..", ".env") });

const PORT = process.env.PORT || 80;

if (process.env.NODE_ENV != "test")
  database
    .Connection()
    .then(() => console.log("Database Connected !"))
    .catch((e) => console.error(e));

const server = app.listen(PORT, () =>
  console.log(`Server's Running at Port ${PORT}`),
);

export { server };
