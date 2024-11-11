const express = require('express');
const router = express.Router();
const Watch = require('../models/Watch'); 


router.post('/', async (req, res) => {
    const newItem = new Watch({
        name: req.body.name,
        brand: req.body.brand,
        model: req.body.model,
        startingBid: req.body.bid, 
        currentBid: req.body.bid,    
        auction_end_time: req.body.auction_end_time,
        description: req.body.description,
        image: req.body.image 
    });

    if (!newItem.name || !newItem.brand || !newItem.model || !newItem.startingBid || !newItem.auction_end_time) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        const savedItem = await newItem.save(); // Save to database
        res.status(201).json(savedItem);
    } catch (error) {
        console.error("Error saving watch:", error);
        res.status(500).json({ message: "Error saving watch." });
    }
});

router.get('/', async (req, res) => {
    try {
        const watches = await Watch.find();
        res.json(watches);
    } catch (error) {
        console.error("Error fetching watches:", error);
        res.status(500).json({ message: "Error fetching watches." });
    }
});

module.exports = router;