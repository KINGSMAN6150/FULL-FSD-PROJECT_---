const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Log email credentials (remove in production)
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Password:', process.env.EMAIL_APP_PASSWORD ? 'Set' : 'Not Set');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

router.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Auction Reminder Service',
        text: 'Thank you for subscribing to our reminder service. You will receive updates about your favorite auctions.'
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).json({ message: 'Subscription successful' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
});

module.exports = router;