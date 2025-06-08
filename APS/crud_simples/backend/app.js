const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');  // Importa o middleware cors
const complaintsRoute = require('./routes/complaints');
const carrosRoute = require('./routes/carros');
const alunosRoute = require('./routes/alunos');

dotenv.config();

const app = express();

app.use(cors());  // Ativa o CORS para todas as rotas

// Caso fosse limitar o acesso do CORS
// const corsOptions = {
//     origin: 'http://127.0.0.1:5500',
//     optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

app.use('/api/complaints', complaintsRoute);
app.use('/api/carros', carrosRoute);
app.use('/api/alunos', alunosRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
