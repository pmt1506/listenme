import nodemailer from "nodemailer";

export const sendWelcomeEmail = async (to: string, username: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Listenme" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎉 Chào mừng đến với Listenme!",
    html: `
    <!DOCTYPE html>
    <html lang="vi">

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thư Chào Mừng</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #333333;
        }
        .content {
          font-size: 16px;
          color: #555555;
          line-height: 1.6;
          padding: 30px 50px;
        }
        .btn {
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          background-color: rgb(103, 193, 106);
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .btn:hover {
          background-color: rgb(82, 176, 84);
          transform: translateY(-2px);
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #999999;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <div class="header">
          <h1>Chào mừng đến với Listenme, ${username}!</h1>
        </div>
        <div class="content">
          <p>Chúng tôi rất vui khi bạn đã tham gia cùng chúng tôi. 🎧</p>
          <p>Với Listenme, bạn có thể tận hưởng các playlist, podcast và nhiều hơn thế nữa.</p>
          <p>Nhấn vào nút bên dưới để bắt đầu:</p>
          <a href="https://listenme.com" class="btn">Bắt đầu ngay</a>
          <p>Nếu bạn không đăng ký Listenme, vui lòng bỏ qua email này.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Listenme. Mọi quyền được bảo lưu.
        </div>
      </div>
    </body>

    </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
