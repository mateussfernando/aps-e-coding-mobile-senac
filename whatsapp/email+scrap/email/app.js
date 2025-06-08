require('dotenv').config();
const nodemailer = require('nodemailer');

// Criação do transportador de e-mail com base nas variáveis de ambiente
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Função para enviar o e-mail
async function sendEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"Nome do Remetente" <${process.env.EMAIL_USER}>`, // Remetente
      to: 'geraldoj8@gmail.com', // Lista de destinatários
      subject: 'Assunto do E-mail', // Assunto
      text: 'Conteúdo do e-mail em texto simples', // Corpo do e-mail em texto simples
      html: '<b>Conteúdo do e-mail em HTML</b>', // Corpo do e-mail em HTML
    });

    console.log('E-mail enviado: %s', info.messageId);
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
  }
}

// Dispara o e-mail
sendEmail();
