const client = require('../db/postgresql');

const tasksRepository = {
  getAll: async (userId) => {
    try {
      const query = `
        SELECT * FROM tasks 
        WHERE user_id = $1 
        ORDER BY 
          CASE WHEN completed THEN 1 ELSE 0 END,
          CASE priority
            WHEN 'high' THEN 1
            WHEN 'medium' THEN 2
            WHEN 'low' THEN 3
            ELSE 4
          END,
          due_date ASC
      `;
      const result = await client.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const query = 'SELECT * FROM tasks WHERE id = $1';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar tarefa por ID:', error);
      throw error;
    }
  },

  create: async (task) => {
    const { userId, title, description, dueDate, priority } = task;

    try {
      const query = `
        INSERT INTO tasks 
          (user_id, title, description, due_date, priority)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;

      const values = [userId, title, description, dueDate, priority || 'medium'];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  },

  update: async (id, task) => {
    const { title, description, dueDate, priority, completed } = task;

    try {
      const query = `
        UPDATE tasks
        SET 
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          due_date = COALESCE($3, due_date),
          priority = COALESCE($4, priority),
          completed = COALESCE($5, completed)
        WHERE id = $6
        RETURNING *;
      `;

      const values = [title, description, dueDate, priority, completed, id];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      throw error;
    }
  },

  completeTask: async (id, pomodoroCount) => {
    try {
      const query = `
        UPDATE tasks
        SET 
          completed = true,
          pomodoro_count = COALESCE($1, pomodoro_count + 1)
        WHERE id = $2
        RETURNING *;
      `;
      const result = await client.query(query, [pomodoroCount, id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao marcar tarefa como completa:', error);
      throw error;
    }
  },

  getByPriority: async (userId, priority) => {
    try {
      const query = `
        SELECT * FROM tasks 
        WHERE user_id = $1 AND priority = $2
        ORDER BY due_date ASC
      `;
      const result = await client.query(query, [userId, priority]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar tarefas por prioridade:', error);
      throw error;
    }
  }
};

module.exports = tasksRepository;