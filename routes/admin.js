const express = require('express');
const { User, Writer, Order } = require('../models');

const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get all writers
router.get('/writers', async (req, res) => {
  try {
    const writers = await Writer.find();
    res.json(writers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching writers' });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Delete user or writer
router.delete('/:type/:id', async (req, res) => {
  const { type, id } = req.params;

  try {
    if (type === 'users') {
      await User.findByIdAndDelete(id);
    } else if (type === 'writers') {
      await Writer.findByIdAndDelete(id);
    }
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting record' });
  }
});

module.exports = router;
