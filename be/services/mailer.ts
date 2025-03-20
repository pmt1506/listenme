import { transporter } from "../utils/mailer";

export const sendWelcomeEmail = async (to: string, username: string) => {
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

export const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: `"Listenme" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔐 Mã Xác Thực OTP từ Listenme",
    html: `
    <!DOCTYPE html>
    <html lang="vi">

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mã OTP</title>
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
          text-align: center;
        }
        .otp-box {
          display: inline-block;
          background-color: #f0f0f0;
          color: #222;
          padding: 15px 25px;
          font-size: 24px;
          letter-spacing: 4px;
          border-radius: 8px;
          margin-top: 20px;
          font-weight: bold;
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
          <h1>Mã OTP của bạn</h1>
        </div>
        <div class="content">
          <p>Đây là mã OTP để xác thực yêu cầu của bạn trên Listenme:</p>
          <div class="otp-box">${otp}</div>
          <p>Mã OTP sẽ hết hạn sau 5 phút.</p>
          <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
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
