import Mail from "nodemailer/lib/mailer";
import { renderFile } from "ejs";
import { resolve } from "path";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "../libs/nodemailer";

class EmailTransporterHandler {
  async sendEmailConfirmation(
    emailOptions: Mail.Options,
  ): Promise<SMTPTransport.SentMessageInfo> {
    try {
      const { subject, from, to, text } = emailOptions;
      const htmlToString = await renderFile(
        resolve(__dirname, ".", "views", "htmlOption.ejs"),
      );

      console.log(`${htmlToString} (EmailTransporterHandler - 16)`);

      return await nodemailer.sendMail({
        html: htmlToString,
        subject,
        from,
        to,
        text,
      });
    } catch (e) {
      throw e;
    }
  }
}

export { EmailTransporterHandler };
