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

router.post('/send-reminder', async (req, res) => {
    const { productName, currentBid, endTime, userEmail } = req.body;

    console.log('Received reminder request for:', {
        productName,
        currentBid,
        endTime,
        userEmail
    });

    if (!userEmail) {
        console.error('No user email provided');
        return res.status(400).json({ message: 'User email is required' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Auction Reminder: ${productName}`,
        html: `
            <h2>Auction Reminder</h2>
            <p>You have set a reminder for the auction of <strong>${productName}</strong></p>
            <p>Current bid: $${currentBid}</p>
            <p>Auction ends at: ${endTime}</p>
            <p>We will notify you of any updates regarding this auction.</p>
            <br>
            <p>Best regards,</p>
            <p>Your Auction Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reminder email sent successfully to:', userEmail);
        res.status(200).json({ message: 'Reminder email sent successfully' });
    } catch (error) {
        console.error('Error sending reminder email:', error);
        res.status(500).json({ 
            message: 'Failed to send reminder email', 
            error: error.message 
        });
    }
});
module.exports = router;