import { Queue } from "bull";

export default interface IQueue {
  name: string;
  instanceQueue?: Queue<unknown>;
}
