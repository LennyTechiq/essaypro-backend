const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User model
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

// Password hashing before saving a user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', UserSchema);

// Writer model
const WriterSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  skills: [String]
});

// Password hashing before saving a writer
WriterSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Writer = mongoose.model('Writer', WriterSchema);

// Order model
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  deadline: Date,
  wordCount: Number,
  price: Number,
  status: { type: String, default: 'Available' },
  bids: [
    {
      writerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Writer' },
      bidAmount: { type: Number, required: true, min: 0 }  // Bid amount should be a positive number
    }
  ]
});

// Validation for the `bids` field (optional but good practice)
OrderSchema.methods.addBid = function (writerId, bidAmount) {
  if (bidAmount <= 0) {
    throw new Error('Bid amount must be greater than 0');
  }
  this.bids.push({ writerId, bidAmount });
  return this.save();
};

const Order = mongoose.model('Order', OrderSchema);

module.exports = { User, Writer, Order };
