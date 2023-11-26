const nodemailer = require('nodemailer')
const { options } = require('../app')

const sendEmail = async options => {
    //1) create transporter 
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    //2) create mail options
    const mailOptions = {
        from: 'Saravanan Kannan <saravananwayne@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
    }

    //3) Send the mail
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail