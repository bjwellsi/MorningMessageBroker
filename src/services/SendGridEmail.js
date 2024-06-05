const sgMail = require("@sendgrid/mail");

function sendEmail(destination, subject, message) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const sourceAddress = process.env.SOURCE_ADDRESS;
  sgMail.setApiKey(apiKey);
  const msg = {
    to: destination,
    from: sourceAddress,
    subject: subject,
    text: message,
    html: "<strong>" + message + "</strong>",
  };

  return sgMail.send(msg);
}

module.exports = { sendEmail };
