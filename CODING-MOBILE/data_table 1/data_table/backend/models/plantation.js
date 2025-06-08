const mongoose = require('mongoose');

const plantationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    responsible: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Plantation = mongoose.model('Plantation', plantationSchema);

module.exports = Plantation;
