const Plantation = require('../models/plantation');

// Criar nova plantação
exports.createPlantation = async (req, res) => {
    try {
        const { name, description, responsible } = req.body;
        const plantation = new Plantation({ name, description, responsible });
        await plantation.save();
        res.status(201).json(plantation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Listar todas as plantações
exports.getPlantations = async (req, res) => {
    try {
        const plantations = await Plantation.find().populate('responsible', 'name');
        res.status(200).json(plantations);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getPlantationById = async (req, res) => {
    try {
        const plantation = await Plantation.findById(req.params.id).populate('responsible', 'name');
        if (!plantation) {
            return res.status(404).json({ message: 'Plantação não encontrada' });
        }
        res.status(200).json(plantation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Atualizar plantação
exports.updatePlantation = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, responsible } = req.body;

        const updatedPlantation = await Plantation.findByIdAndUpdate(id, { name, description, responsible }, { new: true });
        if (!updatedPlantation) return res.status(404).json({ message: 'Plantação não encontrada' });

        res.status(200).json(updatedPlantation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Excluir plantação
exports.deletePlantation = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPlantation = await Plantation.findByIdAndDelete(id);
        if (!deletedPlantation) return res.status(404).json({ message: 'Plantação não encontrada' });

        res.status(200).json({ message: 'Plantação excluída com sucesso' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
