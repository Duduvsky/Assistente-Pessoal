const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

// Listar todas as tarefas de um usuário
router.get('/', tasksController.list);

// Obter uma tarefa específica
router.get('/:id', tasksController.get);

// Criar nova tarefa
router.post('/', tasksController.create);

// Atualizar tarefa
router.put('/:id', tasksController.update);

// Excluir tarefa
router.delete('/:id', tasksController.delete);

// Marcar tarefa como completa
router.post('/:id/complete', tasksController.complete);

// Listar tarefas por prioridade
router.get('/priority/:userId/:priority', tasksController.getByPriority);

module.exports = router;