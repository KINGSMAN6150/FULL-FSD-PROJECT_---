const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

// In-memory collection to store items
let collection = []; // Initialize the collection

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increase the limit to 10mb

// POST endpoint to receive watch data from the Sell form
app.post('/api/collection', (req, res) => {
    const newItem = {
        name: req.body.name,
        brand: req.body.brand,
        model: req.body.model,
        startingBid: req.body.bid,  // This is the starting bid
        currentBid: req.body.bid,    // Set the current bid initially to the starting bid
        auction_end_time: req.body.auction_end_time,
        description: req.body.description,
        image: req.body.image // Ensure you capture the image URL if needed
    };

    // Check if the required fields are present
    if (!newItem.name || !newItem.brand || !newItem.model || !newItem.startingBid || !newItem.auction_end_time) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    collection.push(newItem); // Add the new item to the collection

    // Display the current collection in the terminal
    console.log('Current Collection:', JSON.stringify(collection, null, 2));

    res.status(201).json(newItem); // Respond with the created item
});

// GET endpoint to retrieve a specific product by name or the entire collection
app.get('/api/collection', (req, res) => {
    const { name } = req.query; // Get the name parameter from the query string
    if (name) {
        const product = collection.find(item => item.name === name); // Find the product by name
        if (product) {
            return res.json(product); // Return the product if found
        } else {
            return res.status(404).json({ message: 'Product not found' }); // Return 404 if not found
        }
    }
    res.json(collection); // If no name is specified, return the entire collection
});

// POST endpoint to place a bid on a product
app.post('/api/place-bid', (req, res) => {
    const { name, bid } = req.body;

    const product = collection.find(item => item.name === name);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if (bid <= product.currentBid) {
        return res.status(400).json({ message: 'Bid must be higher than the current bid' });
    }

    product.currentBid = bid; // Update the current bid, but keep starting bid unchanged

    res.json({ newBid: product.currentBid });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
