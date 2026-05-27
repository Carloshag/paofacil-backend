const { User } = require('../models');
const jwt = require('jsonwebtoken');
const dns = require('dns').promises;
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'false' ? false : true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const senderEmail = process.env.EMAIL_SENDER || '"Equipe PãoFácil" <noreply@paofacil.com>';
console.log('🏁 SMTP configurado de forma dinâmica para suporte a provedores de e-mail.');

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendEmail = async ({ to, subject, text, html }) => {
  // Se for uma chave do Resend (começa com re_), envia via API HTTP para evitar bloqueios de SMTP na Render (Portas 25/465/587)
  if (process.env.EMAIL_PASS && process.env.EMAIL_PASS.startsWith('re_')) {
    try {
      const from = process.env.EMAIL_SENDER || 'onboarding@resend.dev';
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EMAIL_PASS}`
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text,
          html
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Resend API Error: ${errorText}`);
      }

      console.log(`✉️ E-mail enviado com sucesso via Resend HTTP API para: ${to}`);
      return true;
    } catch (apiError) {
      console.error(`❌ Falha ao enviar e-mail via Resend HTTP API para ${to}:`, apiError.message);
      return false;
    }
  }

  // Caso contrário, faz fallback para o Nodemailer SMTP tradicional (ideal para desenvolvimento local)
  if (transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      await transporter.sendMail({
        from: senderEmail,
        to,
        subject,
        text,
        html
      });
      console.log(`✉️ E-mail enviado com sucesso via SMTP para: ${to}`);
      return true;
    } catch (smtpError) {
      console.error(`❌ Falha ao enviar e-mail via SMTP para ${to}:`, smtpError.message);
      return false;
    }
  }

  console.log(`⚠️ Envio de e-mail ignorado: Credenciais SMTP/Resend não configuradas.`);
  return false;
};

const register = async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      if (!userExists.is_verified) {
         return res.status(400).json({ error: 'Email já cadastrado, mas a conta ainda não foi verificada. Volte para o login.' });
      }
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    const verification_code = generateCode();

    const user = await User.create({ 
      nome, 
      email, 
      senha, 
      role,
      is_verified: role === 'admin' ? true : false,
      verification_code: role === 'admin' ? null : verification_code
    });
    
    if (!user.is_verified) {
      console.log(`🔑 [DEBUG] Código de verificação gerado para ${email}: ${verification_code}`);
      
      // Envio de e-mail assíncrono (não bloqueante)
      sendEmail({
        to: email,
        subject: "Código de Verificação - PãoFácil",
        text: `Olá ${nome}, seu código de verificação é: ${verification_code}`,
        html: `<b>Olá ${nome}</b>,<br>Acesse o app e digite o seguinte código para ativar sua conta: <br><br><h2>${verification_code}</h2>`
      });
    }

    return res.status(201).json({ 
      message: 'Usuário cadastrado com sucesso! Verifique seu e-mail.',
      user: { id: user.id, nome: user.nome, email: user.email, is_verified: user.is_verified }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao cadastrar usuário.', details: error.message });
  }
};

const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    
    if (user.is_verified) {
      return res.status(400).json({ error: 'Usuário já está verificado.' });
    }

    if (user.verification_code !== String(code)) {
      return res.status(400).json({ error: 'Código de verificação incorreto.' });
    }

    user.is_verified = true;
    user.verification_code = null;
    await user.save();

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Email verificado com sucesso.',
      token,
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role, is_verified: true }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao verificar código.', details: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    if (!user.is_verified) {
      return res.status(403).json({ error: 'A conta precisa ser validada por e-mail antes do login.', require_verification: true });
    }

    const isPasswordValid = await user.checkPassword(senha);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      token,
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role, is_verified: true }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao realizar login.', details: error.message });
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nome', 'email', 'role', 'is_verified', 'created_at'],
      order: [['created_at', 'DESC']]
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const verification_code = generateCode();
    user.verification_code = verification_code;
    await user.save();

    // Envio de e-mail assíncrono (não bloqueante)
    sendEmail({
      to: email,
      subject: "Recuperação de Senha - PãoFácil",
      text: `Olá ${user.nome}, seu código para redefinição de senha é: ${verification_code}`,
      html: `<b>Olá ${user.nome}</b>,<br>Recebemos uma solicitação de redefinição de senha para sua conta.<br>Utilize o código abaixo para cadastrar uma nova senha: <br><br><h2>${verification_code}</h2><br>Se não foi você, ignore este e-mail.`
    });

    return res.status(200).json({ message: 'Código de recuperação enviado. Verifique seu e-mail.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao solicitar redefinição de senha.', details: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, novaSenha } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (!user.verification_code || user.verification_code !== String(code)) {
      return res.status(400).json({ error: 'Código de recuperação inválido ou expirado.' });
    }

    user.senha = novaSenha;
    user.verification_code = null;
    await user.save();

    return res.status(200).json({ message: 'Senha redefinida com sucesso. Você já pode fazer login.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao redefinir senha.', details: error.message });
  }
};

const resendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (user.is_verified) {
      return res.status(400).json({ error: 'Este e-mail já foi verificado e a conta está ativa.' });
    }

    const verification_code = generateCode();
    user.verification_code = verification_code;
    await user.save();

    console.log(`🔑 [DEBUG] Novo código de verificação gerado para ${email}: ${verification_code}`);

    // Envio de e-mail assíncrono (não bloqueante)
    sendEmail({
      to: email,
      subject: "Novo Código de Verificação - PãoFácil",
      text: `Olá ${user.nome}, seu novo código de verificação é: ${verification_code}`,
      html: `<b>Olá ${user.nome}</b>,<br>Você solicitou um novo código de verificação para sua conta.<br>Acesse o app e digite o seguinte código: <br><br><h2>${verification_code}</h2>`
    });

    return res.status(200).json({ message: 'Novo código de verificação enviado!' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao reenviar código.', details: error.message });
  }
};

module.exports = { register, login, verifyCode, listUsers, requestPasswordReset, resetPassword, resendCode };
