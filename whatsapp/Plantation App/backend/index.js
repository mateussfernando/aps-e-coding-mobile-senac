const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://localhost:27017/plantations');

const Plantation = mongoose.model('Plantation', {
  name: String,
  description: String,
  photo: String,
  latitude: Number,
  longitude: Number,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.get('/plantations', async (req, res) => {
  const plantations = await Plantation.find();
  res.json(plantations);
});

app.post('/plantations', upload.single('photo'), async (req, res) => {
  const { name, description, latitude, longitude } = req.body;
  const photo = req.file ? req.file.path : null;
  const plantation = new Plantation({ name, description, photo, latitude, longitude });
  await plantation.save();
  res.json(plantation);
});

app.listen(3000, () => console.log('Backend listening on port 3000'));