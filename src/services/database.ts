import SQLite from '@sqlite.org/sqlite-wasm';

let db: any = null;

export const initDatabase = async () => {
  const sqlite3 = await SQLite.initialize();
  db = new sqlite3.oo1.DB();
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      timeElapsed INTEGER DEFAULT 0,
      isRunning BOOLEAN DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
  
  return db;
};

export const getDb = () => db;

export const createUser = (name: string) => {
  const stmt = db.prepare('INSERT INTO users (name) VALUES (?)');
  stmt.run([name]);
  return db.selectValue('SELECT last_insert_rowid()');
};

export const getUserByName = (name: string) => {
  return db.selectObject('SELECT * FROM users WHERE name = ?', [name]);
};

export const getTasks = (userId: number) => {
  return db.selectObjects('SELECT * FROM tasks WHERE user_id = ?', [userId]);
};

export const createTask = (userId: number, name: string) => {
  const stmt = db.prepare('INSERT INTO tasks (user_id, name) VALUES (?, ?)');
  stmt.run([userId, name]);
  return db.selectValue('SELECT last_insert_rowid()');
};

export const updateTaskTime = (taskId: number, timeElapsed: number) => {
  const stmt = db.prepare('UPDATE tasks SET timeElapsed = ? WHERE id = ?');
  stmt.run([timeElapsed, taskId]);
};

export const deleteTask = (taskId: number) => {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run([taskId]);
};

export const updateTaskRunningState = (taskId: number, isRunning: boolean) => {
  const stmt = db.prepare('UPDATE tasks SET isRunning = ? WHERE id = ?');
  stmt.run([isRunning ? 1 : 0, taskId]);
};