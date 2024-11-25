const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, '80403778bada3434c30d5d2fa84e9a86ea675c1ed092ef13d0e616ac473e0e3bc9260b720eafedb73b2053e46ba2373de402009a2f3166938a922a8654b63a10c64af8a688b1f481180be36a19e7b49d19b5acf3e526ca9231a06563fdebb6010e87b13a54df2048d5727e889316da73a11f0371e36d02e7d8e059a427686f81eb94926204f3018cc4d590bafec2f29b0913516c08b0bdbec6dc7c6795d9a64882b6a9cdda8156e0ee927ca5eabc120a0c08b939c1ac1669d8587a91d60e4868f737a64394a193e5cb60b67490ac1324b6b3fda8723d975ffbc8d30652e250918ab695c7220071499d43e0a7ffb6287120f770e7a8073f20b1d16ef967d4fb55', { expiresIn: '1h' });
  res.json({ token });
});

// Get user profile
router.get('/profile', async (req, res) => {
const token = req.headers['authorization']?.split(' ')[1];

if (!token) {
    return res.status(401).json({ message: 'Token required' });
}

try {
    const decoded = jwt.verify(token, '80403778bada3434c30d5d2fa84e9a86ea675c1ed092ef13d0e616ac473e0e3bc9260b720eafedb73b2053e46ba2373de402009a2f3166938a922a8654b63a10c64af8a688b1f481180be36a19e7b49d19b5acf3e526ca9231a06563fdebb6010e87b13a54df2048d5727e889316da73a11f0371e36d02e7d8e059a427686f81eb94926204f3018cc4d590bafec2f29b0913516c08b0bdbec6dc7c6795d9a64882b6a9cdda8156e0ee927ca5eabc120a0c08b939c1ac1669d8587a91d60e4868f737a64394a193e5cb60b67490ac1324b6b3fda8723d975ffbc8d30652e250918ab695c7220071499d43e0a7ffb6287120f770e7a8073f20b1d16ef967d4fb55');
    const user = await User.findById(decoded.userId);
    if (!user) {
    return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
} catch (err) {
    console.log(err); // Log the error for debugging
    res.status(401).json({ message: 'Invalid token' });
}
});  

module.exports = router;
