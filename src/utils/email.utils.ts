import nodemailer from "nodemailer";

const sendEmail = async (email: string, subject: string, html: string) => {
	try {
		const transporter = nodemailer.createTransport({
			service: process.env.EMAIL_SERVICE,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
		});

		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: email,
			subject,
			html,
		});
		console.log("email sent sucessfully");
	} catch (error) {
		console.log("email not sent");
		console.log(error);
	}
};

export { sendEmail };
