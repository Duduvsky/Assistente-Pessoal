const express = require('express');
const tasksRoutes = require('./routes/tasksRoutes');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());

// Rotas
app.use('/api/tasks', tasksRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});