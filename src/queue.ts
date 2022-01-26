import "reflect-metadata"; // Precaução.
import QueueHandler from "./libs/queue";

const queueHandler = new QueueHandler();

queueHandler
  .init()
  .then(() => console.log("Queue Initialized !"))
  .catch((e) => console.error(e));

export { queueHandler };
