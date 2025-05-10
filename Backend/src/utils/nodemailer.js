const nodemailer = require("nodemailer");
const { nodemailerPassword, nodemailerEmail } = require("../config");

const sendMail = async ({ email, subject, htmlBody, cc, bcc }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: nodemailerEmail,
                pass: nodemailerPassword,
            },
        });

        await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            cc: cc,
            bcc: bcc,
            subject: subject,
            html: htmlBody,
        });

        console.log(`Mail sent successfully to ${email}`);
        if (cc) console.log(`CC: ${cc}`);
        if (bcc) console.log(`BCC: ${bcc}`);
    } catch (error) {
        console.log("Error sending email:", error);
    }
};

module.exports = sendMail;
