const express = require('express');
const router = express.Router();
const { createPlantation, getPlantations, updatePlantation, deletePlantation, getPlantationById } = require('../controllers/plantationController');

// Rotas de plantações
router.post('/', createPlantation);
router.get('/', getPlantations);
router.get('/:id', getPlantationById);
router.put('/:id', updatePlantation); // Rota para atualizar plantação
router.delete('/:id', deletePlantation); // Rota para deletar plantação

module.exports = router;
