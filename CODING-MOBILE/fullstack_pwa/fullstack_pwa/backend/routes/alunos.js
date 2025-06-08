const express = require('express');
const router = express.Router();
const Aluno = require('../models/Aluno');

// Criar uma nova aluna
router.post('/', async (req, res) => {
    const { nome, matricula } = req.body;
    const newAluno = new Aluno({ nome, matricula });
    await newAluno.save();
    res.json(newAluno);
});

// Listar todas as reclamações
router.get('/', async (req, res) => {
    const alunos = await Aluno.find();
    res.json(alunos);
});

// Atualizar uma reclamação
router.put('/:id', async (req, res) => {
    const { nome, matricula } = req.body;
    const updatedAluno = await Aluno.findByIdAndUpdate(req.params.id, { nome, matricula }, { new: true });
    res.json(updatedAluno);
});

// Deletar uma reclamação
router.delete('/:id', async (req, res) => {
    await Aluno.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reclamação deletada com sucesso!' });
});

module.exports = router;
