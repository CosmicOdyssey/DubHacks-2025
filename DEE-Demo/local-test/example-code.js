// Example React Todo App Component
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook for managing todos
function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  }

  return { todos, loading, fetchTodos, setTodos };
}

// TodoItem component
function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  function handleSave() {
    onEdit(todo.id, editText);
    setIsEditing(false);
  }

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
        />
      ) : (
        <span
          style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.text}
        </span>
      )}
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
}

// Main TodoApp component
export default function TodoApp() {
  const { todos, loading, fetchTodos, setTodos } = useTodos();
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  async function addTodo() {
    if (!inputValue.trim()) return;

    try {
      const response = await axios.post('/api/todos', {
        text: inputValue,
        completed: false
      });
      setTodos([...todos, response.data]);
      setInputValue('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  }

  async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    try {
      const response = await axios.put(`/api/todos/${id}`, {
        ...todo,
        completed: !todo.completed
      });
      setTodos(todos.map(t => t.id === id ? response.data : t));
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  }

  async function deleteTodo(id) {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  }

  async function editTodo(id, newText) {
    const todo = todos.find(t => t.id === id);
    try {
      const response = await axios.put(`/api/todos/${id}`, {
        ...todo,
        text: newText
      });
      setTodos(todos.map(t => t.id === id ? response.data : t));
    } catch (error) {
      console.error('Failed to edit todo:', error);
    }
  }

  function clearCompleted() {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);
    completedIds.forEach(id => deleteTodo(id));
  }

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  if (loading) {
    return <div className="loading">Loading todos...</div>;
  }

  return (
    <div className="todo-app">
      <header>
        <h1>My Advanced Todo List</h1>
        <p>{activeCount} active, {completedCount} completed</p>
      </header>

      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      <div className="filter-section">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({todos.length})
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Active ({activeCount})
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed ({completedCount})
        </button>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <p className="empty-state">No todos to show</p>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))
        )}
      </div>

      {completedCount > 0 && (
        <div className="actions">
          <button onClick={clearCompleted}>Clear Completed</button>
          <button onClick={fetchTodos}>Refresh</button>
        </div>
      )}
    </div>
  );
}
