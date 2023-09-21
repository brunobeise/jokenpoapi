import nodemailer from "nodemailer"

export async function sendEmail(email: string, code: string | number) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: 'jokenpo_online@outlook.com',
        pass: 'Jokenpo123#'
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    // Configurações do e-mail
    const mailOptions = {
      from: 'jokenpo_online@outlook.com',
      to: email,
      subject: 'Confirmação de E-mail',
      text: 'Por favor, confirme seu e-mail clicando no link abaixo.',
      html: `<html>
<head>
  <title>Confirmation Code</title>
  <style>
    .container {
      text-align: center;
      font-family: Arial, sans-serif;
    }
    .code {
      font-size: 48px;
      color: yellow;
      font-weight: bold;
      background-color: black;
      padding: 10px;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Confirmation Code</h1>
    <p>Hello,</p>
    <p>Thank you for registering on our website. Below is your six-digit confirmation code:</p>
    <div class="code">
      ${code}
    </div>
    <p>Please enter this code into the appropriate field on our website to complete the verification process.</p>
    <p>Best regards,</p>
    <p>Jokenpo Online</p>
  </div>
</body>
</html>`
    };

    // Enviar e-mail
    return await transporter.sendMail(mailOptions);
  }

  catch (error: any) {
    return error.message
  }


}