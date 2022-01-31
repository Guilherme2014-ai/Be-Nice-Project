import { EmailTransporterHandler } from "../emailTransporter/EmailTransporterHandler";
import IJob from "../interfaces/IJob";

const emailHandler = new EmailTransporterHandler();

export default {
  key: "Validation Mail",
  async handle(mailOptions): Promise<void> {
    await emailHandler.sendEmailConfirmationHandler(mailOptions);
  },
} as IJob;
