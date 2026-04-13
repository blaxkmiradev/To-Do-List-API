const Todo = require('../models/todo');

const todoController = {
  getAllTodos: (req, res) => {
    Todo.getAll((err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  },

  getTodoById: (req, res) => {
    const { id } = req.params;
    Todo.getById(id, (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(row);
    });
  },

  createTodo: (req, res) => {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    Todo.create(title, description, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(result);
    });
  },

  updateTodo: (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    Todo.getById(id, (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      Todo.update(
        id,
        title || row.title,
        description !== undefined ? description : row.description,
        completed !== undefined ? completed : row.completed,
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: 'Todo updated', changes: result.changes });
        }
      );
    });
  },

  deleteTodo: (req, res) => {
    const { id } = req.params;
    Todo.delete(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json({ message: 'Todo deleted' });
    });
  },

  toggleComplete: (req, res) => {
    const { id } = req.params;
    Todo.toggleComplete(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json({ message: 'Todo toggled', changes: result.changes });
    });
  }
};

module.exports = todoController;