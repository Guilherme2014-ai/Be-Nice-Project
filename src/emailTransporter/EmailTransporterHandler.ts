import nodemailer from "../libs/nodemailer";
import Mail from "nodemailer/lib/mailer";
import urlEnviroment from "../config/urlEnviroment";
import { renderFile } from "ejs";
import { resolve } from "path";
import { getRepository } from "typeorm";
import { emailValidationEntity } from "../entities/emailValidationEntity";

class EmailTransporterHandler {
  async sendEmailConfirmationHandler({ data }): Promise<void> {
    try {
      const { to } = data as Mail.Options;

      if (typeof to == "object") {
        const emails = to as string[];

        await Promise.all(
          emails.map(async (userEmail) => {
            const emailValidationSecret = await this.getEmailValidationSecret(
              userEmail,
            );
            return this.sendEmail(userEmail, emailValidationSecret);
          }),
        );
      } else {
        const email = to as string;

        const emailValidationSecret = await this.getEmailValidationSecret(
          email,
        );
        await this.sendEmail(email, emailValidationSecret);
      }
    } catch (e) {
      throw e;
    }
  }

  private async sendEmail(to: string, secret: string): Promise<void> {
    try {
      const htmlToString = await renderFile(
        resolve(__dirname, ".", "views", "htmlOption.ejs"),
        { urlEnviroment, userEmail: to, secret },
      );

      await nodemailer.sendMail({
        html: htmlToString,
        subject: "Confirmação de Email",
        from: "Any <anwony214da775@gmail.com>",
        to,
      });
    } catch (e) {
      throw e;
    }
  }

  private async getEmailValidationSecret(userEmail: string): Promise<string> {
    try {
      const emailStatus = await getRepository(emailValidationEntity).findOne(
        {
          email: userEmail,
        },
        { select: ["secret"] },
      );

      const { secret } = emailStatus;

      return secret;
    } catch (e) {
      throw e;
    }
  }
}

export { EmailTransporterHandler };
