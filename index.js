const express = require('express');
const multer = require('multer');
const tasksRoutes = require('./routes/tasksRoutes');
require('dotenv').config();

const upload = multer();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.none());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/tasks', tasksRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'API do Assistente Pessoal',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('[ERRO]', err.stack);
  res.status(500).json({
    error: 'Ocorreu um erro interno no servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\nServidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`URL: http://localhost:${PORT}\n`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  process.exit(1);
});