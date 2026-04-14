require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
connectTimeoutMS: 2000
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur MongoDB:', err));