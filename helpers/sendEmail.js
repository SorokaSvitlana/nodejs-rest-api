import nodemailer from "nodemailer";
import "dotenv/config";

const {GMAIL_EMAIL, GMAIL_PASS} = process.env;

const nodemailerConfig = {
    host: 'smtp.gmail.com',
    port: 465, 
    secure: true,
    auth: {
        user: GMAIL_EMAIL,
        pass: GMAIL_PASS,
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = data => {
    const email = {...data, from: GMAIL_EMAIL};
    return transport.sendMail(email);
}

export default sendEmail;