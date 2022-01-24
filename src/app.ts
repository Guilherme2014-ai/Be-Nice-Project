import express, { Application } from "express";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";
import router from "./routes";

class App {
  app: Application = express();

  constructor() {
    this.Middlewares();
    this.Routes();
    this.ErrorHandler();
  }

  Middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }
  Routes() {
    this.app.use("/", router);
  }
  ErrorHandler() {
    this.app.use(errorHandlerMiddleware);
  }
}

export default new App().app;
