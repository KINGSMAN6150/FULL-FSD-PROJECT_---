import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import './ProductDisplay.css';
import Footer from '../Footer/Footer';
import { ShopContext } from "../../Context/Context";
import BiddingModal from '../BiddingModal/BiddingModal';
import { io } from "socket.io-client";

const ProductDisplay = () => {
    const { productName } = useParams();
    const [product, setProduct] = useState(null);
    const [currentBid, setCurrentBid] = useState(null);
    const [error, setError] = useState(null);
    const { addToCart, user } = useContext(ShopContext); // Get user from context
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const socket = io("http://localhost:5000");

        socket.on("bidUpdate", (data) => {
            if (data.name === productName) {
                setCurrentBid(data.currentBid);
            }
        });

        return () => socket.disconnect();
    }, [productName]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/collection?name=${encodeURIComponent(productName)}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                if (data) {
                    setProduct(data);
                    setCurrentBid(data.currentBid || data.startingBid);
                } else {
                    setError('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setError('Failed to fetch product.');
            }
        };
        fetchProduct();
    }, [productName]);

    const handleAddToReminder = async () => {
        if (!user) {
            alert('Please login to set reminders');
            return;
        }

        addToCart(product.name);
        
        try {
            const response = await fetch('http://localhost:3000/api/email/send-reminder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productName: product.name,
                    currentBid: currentBid,
                    endTime: product.auction_end_time,
                    userEmail: user.email // Use email from logged-in user
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log('Reminder email sent successfully');
                alert('Reminder set and email sent!');
            } else {
                console.error('Failed to send reminder:', data.message);
                alert(`Failed to send reminder email: ${data.message}`);
            }
        } catch (error) {
            console.error('Error sending reminder email:', error);
            alert('Failed to send reminder email. Please try again.');
        }
    };

    const handleBid = async (amount) => {
        try {
            const response = await fetch(`http://localhost:5000/api/place-bid`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: productName, bid: amount })
            });

            if (response.ok) {
                const { newBid } = await response.json();
                setCurrentBid(newBid);
            } else {
                console.error("Failed to place bid");
            }
        } catch (error) {
            console.error("Error placing bid:", error);
        }
    };

    if (error) return <div>{error}</div>;
    if (!product) return <div>Loading...</div>;

    return (
        <div>
            <div className="productdisplay">
                <div className="productdisplay-left">
                    <div className="productdisplay-img"> 
                        <img src={product.image} alt={product.name} />
                    </div>
                </div>
                <div className="productdisplay-right">
                    <label>Product Name:</label>
                    <h1>{product.name}</h1>
                    <label>Product Brand:</label>
                    <p>{product.brand}</p>
                    <label>Product Model:</label>
                    <p>{product.model}</p>
                    <label>Product Starting Bid:</label>
                    <p>${product.startingBid}</p>
                    <label>Current Bid:</label>
                    <p>${currentBid}</p>
                    <label>Product Condition:</label>
                    <p>{product.condition}</p>
                    <label>Product Auction End Time:</label>
                    <p>{product.auction_end_time}</p>
                    <button onClick={handleAddToReminder}>Add to Reminder</button>
                    <button onClick={() => setModalOpen(true)}>Bid</button>
                </div>
            </div>
            <div className="description">
                <label>Description:</label>
                <p>{product.description}</p>
            </div>
            <Footer />
            <BiddingModal 
                isOpen={isModalOpen} 
                onClose={() => setModalOpen(false)} 
                onBid={handleBid} 
                currentBid={currentBid}
            />
        </div>
    );
}

export default ProductDisplay;