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

        emails.forEach(async (userEmail) => {
          const emailValidationSecret = await this.getEmailValidationSecret(
            userEmail,
          );
          await this.sendEmail(userEmail, emailValidationSecret);
        });
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
  }

  private async getEmailValidationSecret(userEmail: string): Promise<string> {
    const emailValidationRepository = getRepository(emailValidationEntity);
    const emailStatus = await emailValidationRepository.findOne({
      email: userEmail,
    });

    return emailStatus.secret;
  }
}

export { EmailTransporterHandler };
