const express = require('express');
const router = express.Router();
const Carro = require('../models/Carro');

// Criar uma nova reclamação
router.post('/', async (req, res) => {
    const { marca, modelo } = req.body;
    const newCarro = new Carro({ marca, modelo });
    await newCarro.save();
    res.json(newCarro);
});

// Listar todas as reclamações
router.get('/', async (req, res) => {
    const carros = await Carro.find();
    res.json(carros);
});

// Atualizar uma reclamação
router.put('/:id', async (req, res) => {
    const { marca, modelo } = req.body;
    const updatedCarro = await Carro.findByIdAndUpdate(req.params.id, { marca, modelo }, { new: true });
    res.json(updatedCarro);
});

// Deletar uma reclamação
router.delete('/:id', async (req, res) => {
    await Carro.findByIdAndDelete(req.params.id);
    res.json({ message: 'Carro deletado com sucesso!' });
});

module.exports = router;
