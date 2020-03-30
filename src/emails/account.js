const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "amarnath26595@gmail.com",
        subject: "Welcome to Task-Manager",
        text: `Hi ${name}! \nWelcome to Task-Manager App. Let me know how I can be helpful.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "amarnath26595@gmail.com",
        subject:"We're sad to see you leave!",
        text: `Hi ${name}! \nWe are sad to see you go. Please us know your feedback at feedback.com.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}