import React, { useState } from "react";
import './Receive.css'

const Receive = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear any previous messages
        try {
            // Make sure this URL matches your backend server address and port
            const response = await fetch('http://localhost:3000/api/email/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            if (response.ok) {
                setMessage('Subscription successful! Check your email for confirmation.');
                setEmail('');
            } else {
                setMessage(`Subscription failed: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error details:', error);
            setMessage(`An error occurred: ${error.message}`);
        }
    };

    return (
        <div className="receive">
            <h1>Get reminder on your email</h1>
            <p>Subscribe to our reminder service to receive updates on your favorite auctions.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                />
                <button type="submit">Subscribe</button>
            </form>
            {message && <p className={message.includes('successful') ? 'success' : 'error'}>{message}</p>}
        </div>
    );
};

export default Receive;