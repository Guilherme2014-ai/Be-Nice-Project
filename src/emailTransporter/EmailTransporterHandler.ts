import Mail from "nodemailer/lib/mailer";
import { renderFile } from "ejs";
import { resolve } from "path";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "../libs/nodemailer";

class EmailTransporterHandler {
  async sendEmailConfirmation({
    data,
  }): Promise<SMTPTransport.SentMessageInfo> {
    try {
      const { to } = data as Mail.Options;
      const htmlToString = await renderFile(
        resolve(__dirname, ".", "views", "htmlOption.ejs"),
      );

      return await nodemailer.sendMail({
        html: htmlToString,
        subject: "Confirmação de Email",
        from: "Any <anwony214da775@gmail.com>",
        to,
      });
    } catch (e) {
      throw e;
    }
  }
}

export { EmailTransporterHandler };
