'use server'
import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kbdevika20@gmail.com',
        pass: 'yghj qsvr xjad mhph'
    }
});

// Function to send an email
const sendEmail = async (text: string) => {
  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
        from: 'kbdevika20@gmail.com',
        to: 'kbdevika20@gmail.com',
        subject: 'You have a new job recommendation from PlacementApp. See your portal to view more',
        text: text
    });
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
