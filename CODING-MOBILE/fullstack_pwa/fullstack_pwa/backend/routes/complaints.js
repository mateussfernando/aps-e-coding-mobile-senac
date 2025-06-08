const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// Criar uma nova reclamação
router.post('/', async (req, res) => {
    const { title, message } = req.body;
    const newComplaint = new Complaint({ title, message });
    await newComplaint.save();
    res.json(newComplaint);
});

// Listar todas as reclamações
router.get('/', async (req, res) => {
    const complaints = await Complaint.find();
    res.json(complaints);
});

// Atualizar uma reclamação
router.put('/:id', async (req, res) => {
    const { title, message } = req.body;
    const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, { title, message }, { new: true });
    res.json(updatedComplaint);
});

// Deletar uma reclamação
router.delete('/:id', async (req, res) => {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reclamação deletada com sucesso!' });
});

module.exports = router;
