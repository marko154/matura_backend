import nodemailer from "nodemailer";
import fs from "fs";
import ejs from "ejs";
import { htmlToText } from "html-to-text";
import juice from "juice";

import type Mail from "nodemailer/lib/mailer";
import type { User } from ".prisma/client";

const transporter = nodemailer.createTransport({
	service: process.env.EMAIL_SERVICE,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
});

async function sendEmail(options: Omit<Mail.Options, "from">) {
	try {
		await transporter.sendMail({
			from: process.env.EMAIL_USER,
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
		redirectURL: `${process.env.SOLID_APP_URL}/password-reset/${token}`,
		supportURL: `${process.env.SOLID_APP_URL}/support`,
	});
	await sendEmail({
		to: email,
		subject: "Password Reset for Your Account",
		text,
		html,
	});
}

export { sendEmail, sendPasswordResetEmail, sendVerificationEmail };
