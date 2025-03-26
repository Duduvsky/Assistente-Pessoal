const tasksRepository = require('../repositories/tasksRepository');

const tasksController = {
  list: async (req, res) => {
    try {
      const tasks = await tasksRepository.getAll(req.query.userId);
      res.json(tasks);
    } catch (error) {
      console.error('Erro ao listar tarefas:', error);
      res.status(500).json({ error: 'Erro ao listar tarefas.' });
    }
  },

  get: async (req, res) => {
    try {
      const task = await tasksRepository.getById(req.params.id);
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ error: 'Tarefa não encontrada.' });
      }
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      res.status(500).json({ error: 'Erro ao buscar tarefa.' });
    }
  },

  create: async (req, res) => {
    try {
      const { userId, title, description, dueDate, priority } = req.body;

      if (!userId || !title) {
        return res.status(400).json({ 
          error: 'ID do usuário e título são obrigatórios.' 
        });
      }

      const newTask = await tasksRepository.create({
        userId,
        title,
        description,
        dueDate,
        priority
      });

      res.status(201).json(newTask);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).json({ error: 'Erro ao criar tarefa.' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, dueDate, priority, completed } = req.body;

      const existingTask = await tasksRepository.getById(id);

      if (!existingTask) {
        return res.status(404).json({ error: 'Tarefa não encontrada.' });
      }

      const updatedTask = await tasksRepository.update(id, {
        title: title || existingTask.title,
        description: description ?? existingTask.description,
        dueDate: dueDate || existingTask.due_date,
        priority: priority || existingTask.priority,
        completed: completed !== undefined ? completed : existingTask.completed
      });

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
    }
  },

  delete: async (req, res) => {
    try {
      const deletedTask = await tasksRepository.delete(req.params.id);

      if (deletedTask) {
        res.status(200).json({
          message: 'Tarefa excluída com sucesso.',
          task: deletedTask
        });
      } else {
        res.status(404).json({ error: 'Tarefa não encontrada.' });
      }
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      res.status(500).json({ error: 'Erro ao excluir tarefa.' });
    }
  },

  complete: async (req, res) => {
    try {
      const { id } = req.params;
      const { pomodoroCount } = req.body;

      const existingTask = await tasksRepository.getById(id);

      if (!existingTask) {
        return res.status(404).json({ error: 'Tarefa não encontrada.' });
      }

      const updatedTask = await tasksRepository.completeTask(id, pomodoroCount);
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Erro ao completar tarefa:', error);
      res.status(500).json({ error: 'Erro ao completar tarefa.' });
    }
  },

  getByPriority: async (req, res) => {
    try {
      const { userId, priority } = req.params;
      const tasks = await tasksRepository.getByPriority(userId, priority);

      if (tasks.length > 0) {
        res.status(200).json(tasks);
      } else {
        res.status(404).json({
          error: 'Nenhuma tarefa encontrada para a prioridade especificada.'
        });
      }
    } catch (error) {
      console.error('Erro ao buscar tarefas por prioridade:', error);
      res.status(500).json({ error: 'Erro ao buscar tarefas por prioridade.' });
    }
  }
};

module.exports = tasksController;