import { EmailTransporterHandler } from "../emailTransporter/EmailTransporterHandler";
import IJob from "../interfaces/IJob";

const emailHandler = new EmailTransporterHandler();

export default {
  key: "Validation Mail",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handle(mailOptions): Promise<void> {
    await emailHandler.sendEmailConfirmation(mailOptions);
  },
} as IJob;
