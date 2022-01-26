import Queue from "bull";
import redisConfig from "../config/redisConfig";
import IQueue from "../interfaces/IQueue";
import IJob from "../interfaces/IJob";
import jobs from "../jobs";

export default class QueueHandler {
  private queues: IQueue[] = [];
  private readonly jobs: IJob[] = jobs;

  async init(): Promise<void> {
    this.jobs.forEach((job) => {
      const _queue = new Queue(job.key, { redis: redisConfig });

      this.queues.push({
        name: `${job.key}`,
        instanceQueue: _queue,
      });
    });

    console.log(this.queues);

    await this.process();
  }

  async run(queueName: string, queueParams?: unknown): Promise<void> {
    const _queue = this.queues.find((queue) => queue.name == queueName);
    await _queue.instanceQueue.add(queueParams);
  }

  private async process() {
    this.jobs.forEach(async (job) => {
      this.queues.forEach(async (queue) => {
        await queue.instanceQueue.process(job.handle);
      });
    });
  }
}
