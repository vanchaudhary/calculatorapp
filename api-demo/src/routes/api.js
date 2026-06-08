const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Define the GET endpoint to retrieve items
router.get('/items', apiController.getItems);

// Define the POST endpoint to create a new item
router.post('/items', apiController.createItem);

module.exports = router;