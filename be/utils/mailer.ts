import nodemailer from 'nodemailer';

export const sendWelcomeEmail = async (to: string, username: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or any SMTP service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Welcome to My App!',
    html: `<h1>Hello ${username}!</h1><p>Welcome to our platform, we’re glad to have you onboard!</p>`,
  };

  await transporter.sendMail(mailOptions);
};
