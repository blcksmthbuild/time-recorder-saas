import nodemailer from "nodemailer";

const transporterSendGrid = {
  host: "smtp.sendgrid.net",
  port: 465,
  auth: {
    user: "ACedede1972d325b1d554007274d8c6fb5",
    pass: "43055a4bc839fb9a1d5b7bb68a0490a0",
  },
  requireTLS: true,
};
const ztransporter = transporterSendGrid;

const gFromSmartSupport = '"Time Log" <sstamak@proton.me>';

export function sendTo(
  subject: string,
  message: { html: string; text?: string },
  to: string[],
  cc?: string[],
  bcc?: string[],
) {
  return new Promise(function (resolve, reject) {
    let transporter = nodemailer.createTransport(ztransporter);

    const mailOptions = {
      from: gFromSmartSupport,
      to: to,
      subject: subject,
      text: message.text,
      html: message.html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(JSON.stringify(error));
        return;
      }
      resolve("OK");
    });
  });
}
