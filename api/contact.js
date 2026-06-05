const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const service = process.env.EMAIL_SERVICE || 'gmail';
  const from = process.env.EMAIL_FROM || user;
  const to = process.env.EMAIL_TO || 'kkpavank121@gmail.com';

  if (!user || !pass) {
    return res.status(500).json({
      error: 'Email credentials are not configured. Set EMAIL_USER and EMAIL_PASS in environment variables.'
    });
  }

  const transporter = nodemailer.createTransport({
    service,
    auth: {
      user,
      pass
    }
  });

  const mailOptions = {
    from,
    to,
    subject: `Portfolio contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <h2>New contact submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent to', to, 'for contact submission from', email);

    return res.status(200).json({
      success: true,
      message: 'Contact submission received and forwarded via email.'
    });
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return res.status(500).json({
      error: 'Unable to forward message by email. Please check your email settings.'
    });
  }
};
