import React, { useState, useEffect } from "react";
import "../Styles/TodoApp.css";

function TodoApp() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("Personale");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: newTask, category: category, completed: false },
    ]);
    setNewTask("");
    setCategory("Personale");
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="todo-app">
      <h2>Todo App</h2>
      <div className="input-section">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Aggiungi una nuova attività..."
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Personale">Personale</option>
          <option value="Lavoro">Lavoro</option>
          <option value="Studio">Studio</option>
        </select>
        <button onClick={addTask}>Aggiungi</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div>
              <span
                onClick={() => toggleComplete(task.id)}
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  cursor: "pointer",
                }}
              >
                {task.text}
              </span>
              <em> ({task.category})</em>
            </div>
            <button
              className="delete-button"
              onClick={() => deleteTask(task.id)}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
