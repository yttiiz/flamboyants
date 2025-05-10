import { nodemailer } from "@deps";
import { Helper } from "./mod.ts";
import type { MailConfigType, SendParameterType } from "./mod.ts";
import { ContactSendEmailContentType } from "@controllers";

export class Mailer {
  // Outlook config
  private static OUTLOOK_CONFIG: MailConfigType = {
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
  };

  // Hostinger config
  private static HOSTINGER_CONFIG: MailConfigType = {
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
  };

  public static async send({ to, receiver }: SendParameterType) {
    const { email, password, username } = Mailer.getClientMailDetails();
    const transporter = Mailer.getTransporter(email, password);
    const info = await transporter.sendMail({
      from: `${username} - <${email}>`,
      to,
      subject: "Réservation validée",
      text: Mailer.plainText(receiver),
      html: Mailer.html(receiver),
    });

    await Helper.writeEmailLog(
      `Email envoyé le ${
        Helper.displayDate({ style: "normal" })
      }. Id : ${info.messageId},`,
    );
  }

  public static async receive({
    content,
  }: {
    content: ContactSendEmailContentType;
  }) {
    const { email: userEmail, firstname, lastname, message } = content;
    const { email, password, brand } = Mailer.getClientMailDetails();
    const transporter = Mailer.getTransporter(email, password);

    await transporter.sendMail({
      from: `${brand} - <${email}>`,
      to: email,
      subject: "Formulaire de contact",
      text:
        `Message de ${firstname} ${lastname}\nEmail : ${userEmail}\nMessage : ${message}`,
      html: `<h1>Message de ${firstname} ${lastname}</h1>
        <p>Email : ${userEmail}</p>
        <p>Message : ${message}</p>`,
    });
  }

  private static getTransporter(email: string, password: string) {
    return nodemailer.createTransport({
      host: Mailer.HOSTINGER_CONFIG.host,
      port: Mailer.HOSTINGER_CONFIG.port,
      secure: Mailer.HOSTINGER_CONFIG.secure,
      auth: {
        user: email,
        pass: password,
      },
    });
  }

  private static getClientMailDetails() {
    const {
      EMAIL_ADDRESS: email,
      EMAIL_USERNAME: username,
      EMAIL_BRAND: brand,
      EMAIL_PASSWORD: password,
    } = Deno.env.toObject();

    return {
      email,
      username,
      brand,
      password,
    };
  }

  private static plainText(receiver: string) {
    return `Félicitations ${receiver}.\nNous avons bien enregistré votre réservation...`;
  }

  private static html(receiver: string) {
    return `<h1>Félicitations ${receiver}</h1>
    <p>Nous avons bien enregistré votre réservation...</p>`;
  }
}
