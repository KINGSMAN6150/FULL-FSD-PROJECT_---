import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../Context/Context';
import './Reminderitems.css';

const ReminderItems = () => {
    const { cartItems, clearCart, removeFromCart, getTotalReminderItems } = useContext(ShopContext);
    const [storedImages, setStoredImages] = useState({});
    const [productDetails, setProductDetails] = useState({});

    useEffect(() => {
        // Retrieve all images from local storage when the component mounts
        const storedImages = JSON.parse(localStorage.getItem('uploadedImages')) || {};
        setStoredImages(storedImages);
    }, []);

    useEffect(() => {
        // Fetch product details based on names in cartItems
        const fetchProductDetails = async (productName) => {
            try {
                const response = await fetch(`http://localhost:5000/api/collection?name=${encodeURIComponent(productName)}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProductDetails(prevDetails => ({
                    ...prevDetails,
                    [productName]: data // Store the details with the product name as the key
                }));
            } catch (error) {
                console.error(`Failed to fetch details for ${productName}:`, error);
            }
        };

        Object.keys(cartItems).forEach(productName => {
            if (cartItems[productName] > 0) {
                fetchProductDetails(productName);
            }
        });
    }, [cartItems]);

    return (
        <div className="reminderitems">
            <h1>Your Reminders</h1>
            <p>Total Items: {getTotalReminderItems()}</p>
            <div className="reminderitems-format-main">
                <p>Product</p>
                <p>Name:</p>
                <p>Starting Bid:</p>
                <p>Time:</p>
            </div>
            <hr />
            {Object.keys(cartItems).map((productName) => {
                const quantity = cartItems[productName];
                if (quantity > 0) {
                    const imageSrc = storedImages[productName] || 'placeholder.jpg'; // Fallback to placeholder if no image is found
                    const productDetail = productDetails[productName] || {}; // Get the product detail

                    return (
                        <div key={productName}>
                            <div className="reminderitems-format">
                                <img src={productDetail.image} alt={productName} className="remindericon-product-icon" />
                                <p>{productName}</p>
                                <p>${productDetail.bid || 'N/A'}</p>
                                <p>{productDetail.auction_end_time || 'N/A'}</p>
                                <button onClick={() => removeFromCart(productName)}>Remove</button>
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            <button onClick={clearCart}>Clear All Reminders</button>
        </div>
    );
};

export default ReminderItems;
