import React, { useState } from 'react';
import './BiddingModal.css';

const BiddingModal = ({ isOpen, onClose, onBid, currentBid, startingBid }) => {
    const [bidAmount, setBidAmount] = useState('');
    const [error, setError] = useState('');

    const handleBidSubmit = (e) => {
        e.preventDefault();

        // Convert bidAmount to a number and validate that it’s greater than currentBid
        const parsedBidAmount = Number(bidAmount);

        // Ensure bid is greater than the current bid or the starting bid
        if (isNaN(parsedBidAmount) || parsedBidAmount <= Math.max(currentBid, startingBid)) {
            setError("Your bid must be greater than the current bid of $${Math.max(currentBid, startingBid)}");
            return;
        }

        setError('');
        onBid(parsedBidAmount); // Submit the valid bid as a number
        setBidAmount('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close" onClick={onClose}>&times;</button>
                <h2>Place Your Bid</h2>
                <form onSubmit={handleBidSubmit}>
                    <label>
                        Bid Amount:
                        <input 
                            type="number" 
                            value={bidAmount} 
                            onChange={(e) => setBidAmount(e.target.value)} 
                            required 
                            min={Math.max(currentBid, startingBid) + 1} // Ensure input starts above the higher of current or starting bid
                        />
                    </label>
                    {error && <p className="error">{error}</p>} {/* Display error if any */}
                    <button type="submit">Submit Bid</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default BiddingModal;