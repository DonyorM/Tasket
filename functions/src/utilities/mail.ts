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

export function addHtmlUnsubscribeMessage(message: string, groupId: string) {
  return (
    message +
    `\n<br /><span style="font-size: 10px;"><a href="https://tasket.manilas.net/unsubscribe?group=${groupId}>Unsubscribe from this group</a></span>`
  );
}

export function addPlainUnsubscribeMessage(message: string, groupId: string) {
  return (
    message +
    `\nTo unsubscribe from this group's messages go to https://tasket.manilas.net/unsubscribe?group=${groupId}`
  );
}

export function convertPlainToHtml(message: string) {
  return message.replace("\n", "<br />");
}

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
