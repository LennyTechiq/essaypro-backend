const express = require('express');
const { Writer, Order } = require('../models');  // Import both Writer and Order models correctly

const router = express.Router();

// Register a new writer
router.post('/register', async (req, res) => {
  const { name, email, password, skills } = req.body;

  try {
    const writer = new Writer({ name, email, password, skills });
    await writer.save();
    res.status(201).json({ message: 'Writer registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error registering writer' });
  }
});

// Get available orders for writers
router.get('/available', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Available' });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

router.post('/:orderId/bid', async (req, res) => {
    console.log('Received bid request for order:', req.params.orderId);
    
    const { orderId } = req.params;
    const { writerId, bidAmount } = req.body;
  
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      order.bids.push({ writerId, bidAmount });
      await order.save();
  
      res.status(200).json({ message: 'Bid placed successfully', order });
    } catch (err) {
      console.error('Error while placing bid:', err);
      res.status(500).json({ message: 'Something went wrong' });
    }
  });
  

module.exports = router;
