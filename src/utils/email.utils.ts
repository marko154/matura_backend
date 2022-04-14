import nodemailer from "nodemailer";
import fs from "fs";
import ejs from "ejs";
import { htmlToText } from "html-to-text";
import juice from "juice";

import type Mail from "nodemailer/lib/mailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  // secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail(options: Omit<Mail.Options, "from">) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      ...options,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
}

function generateHtml(templateName: string, templateVars: object) {
  const templatePath = __dirname + `/templates/${templateName}.html`;

  if (fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, "utf-8");
    const html = ejs.render(template, templateVars);
    const text = htmlToText(html); // fallback version if html doesn't work
    const htmlWithStylesInlined = juice(html);
    return { text, html: htmlWithStylesInlined };
  }
  throw Error(templateName + " template name doesn't exist.");
}

async function sendVerificationEmail(
  user: { display_name: string | null; email: string },
  token: string
) {
  const { text, html } = generateHtml("email_verification", {
    name: user.display_name,
    verificationURL: `http://localhost:3001/api/user/verify/${token}`,
    supportURL: `${process.env.SOLID_APP_URL}/support`,
  });
  await sendEmail({
    to: user.email,
    subject: "Email Verification for Your Account",
    text,
    html,
  });
}

async function sendPasswordResetEmail(email: string, token: string) {
  const { text, html } = generateHtml("password_reset", {
    name: "Test User",
    redirectURL: `${process.env.SOLID_APP_URL}/reset-password/${token}`,
    supportURL: `${process.env.SOLID_APP_URL}/support`,
  });
  await sendEmail({
    to: email,
    subject: "Password Reset for Your Account",
    text,
    html,
  });
}

async function sendRegistrationInviteEmail(email: string, token: string) {
  const { text, html } = generateHtml("registration_invite", {
    redirectURL: `${process.env.SOLID_APP_URL}/signup?token=${token}`,
    supportURL: `${process.env.SOLID_APP_URL}/support`,
  });
  await sendEmail({
    to: email,
    subject: "Register for an account",
    text,
    html,
  });
}

const logger = fs.createWriteStream("sql.txt", {
  flags: "a", // 'a' means appending (old data will be preserved)
});

for (let i = 0; i < 10000; i++) {
  let line = `(point(${Math.random() * 90}, ${Math.random() * 90})),`;
  logger.write(line);
}

export {
  sendEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendRegistrationInviteEmail,
};
