import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (email, url, title) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      post: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `${title}`,
      text: "Welcome!",
      html: `
            <div>
                <a href="${url}">Click here</a>
            </div>
            `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully!");

    return info;
  } catch (err) {
    console.error("Email sending failed:", err);
    throw err;
  }
};

export const sendNewPasswordEmail = async (email, newPassword) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      post: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "New Password",
      text: "Welcome!",
      html: `
            <div>
                <h3>Reset password successfully</h3>
                <p>This is your new password: ${newPassword}</p>
            </div>
            `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully!");

    return info;
  } catch (err) {
    console.error("Email sending failed:", err);
    throw err;
  }
};
