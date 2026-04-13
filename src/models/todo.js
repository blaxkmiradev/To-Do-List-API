const db = require('../database');

class Todo {
  static getAll(callback) {
    db.all('SELECT * FROM todos ORDER BY created_at DESC', [], callback);
  }

  static getById(id, callback) {
    db.get('SELECT * FROM todos WHERE id = ?', [id], callback);
  }

  static create(title, description, callback) {
    const sql = 'INSERT INTO todos (title, description) VALUES (?, ?)';
    db.run(sql, [title, description || ''], function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null, { id: this.lastID, title, description });
      }
    });
  }

  static update(id, title, description, completed, callback) {
    const sql = `
      UPDATE todos 
      SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    db.run(sql, [title, description, completed ? 1 : 0, id], function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null, { changes: this.changes });
      }
    });
  }

  static delete(id, callback) {
    db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null, { changes: this.changes });
      }
    });
  }

  static toggleComplete(id, callback) {
    const sql = `
      UPDATE todos 
      SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    db.run(sql, [id], function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null, { changes: this.changes });
      }
    });
  }
}

module.exports = Todo;