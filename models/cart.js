// models/cart.js
const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    isBook: Boolean,
    trips: [{ // ← plus de ObjectId/ref, on stocke l'objet complet
        departure: String,
        arrival: String,
        date: Date,
        price: Number
    }]
});

const Cart = mongoose.model('cart', cartSchema);
module.exports = Cart;