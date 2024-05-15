const sgMail = require('@sendgrid/mail')

function sendEmail(destination, subject, message) {
 	const apiKey = process.env.SENDGRID_API_KEY;
	console.log(apiKey);
	sgMail.setApiKey(apiKey);
	const msg = {
		to: destination,
		from: 'bwellsAutomations@gmail.com',
		subject: subject,
		text: message,
		html: '<strong>' + message + '</strong>'
	}

	console.log(msg);

	sgMail
		.send(msg)
		.then(() => { console.log( 'email sent') })
		.catch((err) => { console.error(err); });

}

module.exports = { sendEmail };
