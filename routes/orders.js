const express = require('express');
const { Order } = require('../models');

const router = express.Router();

// Place a new order
router.post('/', async (req, res) => {
  const { userId, title, description, deadline, wordCount, price } = req.body;

  try {
    const order = new Order({ userId, title, description, deadline, wordCount, price });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error placing order' });
  }
});

// Get orders for a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Update order status
router.put('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Error updating order status' });
  }
});

module.exports = router;
