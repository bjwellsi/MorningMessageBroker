const fs = require('fs').promises;
const messager = require('nodemailer');

function sendEmail (message) {
	fs.readFile('./storage/EmailParams.json')
		.then( data => {
			const emailParams = JSON.parse(data);

			console.log(emailParams);

			let transporter = messager.createTransport({
				service: emailParams.service,
				auth: {
					user: emailParams.address,
					pass: emailParams.password
				}
			});

			let mailOptions = {
				from: emailParams.address,
				to: emailParams.recipient,
				subject: 'Message Sent From Node Mailer',
				text: message
			};

			console.log('gmail borked. Would send here');
			/*transporter.sendMail(mailOptions, (err, info) => {
				if (err) {
					console.log(err);
				} else {
					console.log('email sent: ' + info.response);
				}
			});*/
		})
		.catch( err => {console.log(err)});
}

module.exports = { sendEmail };
