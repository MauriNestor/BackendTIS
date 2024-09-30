const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Crea un transportador para nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Usa un servicio local o un servidor SMTP
    auth: {
        user: 'codecraft.developercompany@gmail.com', // Coloca tu correo
        pass: 'nvtb votd jxwz kigg',        // Coloca tu contraseña
    },
});

// Función para generar y enviar el correo
const enviarCorreoRestablecer = async (correo, codigoSis) => {
    try {
        const token = jwt.sign({ id: codigoSis }, 'SECRET_KEY', { expiresIn: '1h' });
        const resetUrl = `http://localhost:3000/reset-password/${token}`;

        const mailOptions = {
            from: '"Sistema MTIS" <codecraft.developercompany@gmail.com>',
            to: correo,
            subject: 'Restablecer tu contraseña',
            text: `Por favor haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
            html: `<p>Por favor haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetUrl}">${resetUrl}</a>`
        };

        await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente a:', correo);
    } catch (err) {
        console.error('Error al enviar correo', err);
        throw err;
    }
};

module.exports = {
    enviarCorreoRestablecer,
};
