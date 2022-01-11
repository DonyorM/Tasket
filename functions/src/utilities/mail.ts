import * as nodemailer from "nodemailer";
import * as functions from "firebase-functions";

export const mailTransport = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: functions.config().smtp,
  tls: {
    ciphers: "SSLv3",
  },
});

export async function sendMessage(
  to: string,
  subject: string,
  text: string,
  htmlText?: string
) {
  const message = {
    from: functions.config().mail.from,
    to: to,
    subject: subject,
    text: text,
    html: htmlText ?? `<p>${text}</p>`,
  };
  functions.logger.log(`Sending mail to ${to} with subject ${subject}`);
  mailTransport.sendMail(message);
}
