// models/cart.js
const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    isBook: {type: Boolean, default: false},
    trips: [{type: mongoose.Schema.Types.ObjectId, ref: 'trips'}]
});

const Cart = mongoose.model('cart', cartSchema);
module.exports = Cart;