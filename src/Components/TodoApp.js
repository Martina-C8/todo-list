import React, { useState, useEffect } from "react";
import "../Styles/TodoApp.css";
import Modal from "./Modal"; // Importa il componente Modal

function TodoApp() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Carica e salva le categorie da/localStorage
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem("categories");
    return savedCategories ? JSON.parse(savedCategories) : ["Personale", "Lavoro", "Studio"];
  });

  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("Personale");
  const [newCategory, setNewCategory] = useState("");
  const [newSubTask, setNewSubTask] = useState("");
  const [showModal, setShowModal] = useState(false); // Stato per controllare la visibilità del modale
  const [selectedTaskId, setSelectedTaskId] = useState(null); // Memorizza l'ID del task per cui aggiungere il sotto-task

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  // Funzione per aggiungere un nuovo task
  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        category: category,
        completed: false,
        subTasks: [],
      },
    ]);
    setNewTask("");
    setCategory("Personale");
  };

  // Funzione per aggiungere una nuova categoria
  const addCategory = () => {
    if (newCategory.trim() === "") return;
  
    // Controlla se la categoria esiste già, ignorando maiuscole e minuscole
    const categoryExists = categories.some(
      (cat) => cat.toLowerCase() === newCategory.trim().toLowerCase()
    );
  
    if (categoryExists) {
      alert("La categoria esiste già!"); // Messaggio di avviso
      setNewCategory(""); // Pulisce il campo
      return;
    }
  
    setCategories([...categories, newCategory.trim()]);
    setNewCategory("");
  };
  
  // Funzione per aggiungere un sotto-task a un task specifico
  const addSubTask = (taskId, subTaskText) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: [
                ...task.subTasks,
                { id: Date.now(), text: subTaskText, completed: false },
              ],
            }
          : task
      )
    );
  };

  // Funzione per marcare un task come completato
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Funzione per marcare un sotto-task come completato
  const toggleSubTaskComplete = (taskId, subTaskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.map((subTask) =>
                subTask.id === subTaskId
                  ? { ...subTask, completed: !subTask.completed }
                  : subTask
              ),
            }
          : task
      )
    );
  };

  // Funzione per eliminare un task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Funzione per eliminare un sotto-task
  const deleteSubTask = (taskId, subTaskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.filter((subTask) => subTask.id !== subTaskId),
            }
          : task
      )
    );
  };

  // Funzione per aprire il modale per aggiungere un sotto-task
  const handleOpenModal = (taskId) => {
    setSelectedTaskId(taskId); // Memorizza l'ID del task
    setShowModal(true); // Mostra il modale
  };

  // Funzione per chiudere il modale
  const handleCloseModal = () => {
    setShowModal(false); // Nascondi il modale
    setSelectedTaskId(null); // Reset ID del task
  };

  return (
    <div className="todo-app">
      <h2>Todo App</h2>
      
      {/* Sezione di input per aggiungere un nuovo task */}
      <div className="input-section">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Aggiungi una nuova attività..."
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={addTask}>Aggiungi attività</button>
      </div>

      {/* Sezione di input per aggiungere nuove categorie */}
      <div className="category-section">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Aggiungi una nuova categoria..."
        />
        <button onClick={addCategory}>Aggiungi Categoria</button>
      </div>

      {/* Lista dei task */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-header">
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

            <div className="task-actions">
              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
              >
                🗑️
              </button>
              <button
                className="add-subtask-button"
                onClick={() => handleOpenModal(task.id)}
              >
                Aggiungi sotto-task
              </button>
            </div>

            {/* Sottotask */}
            {task.subTasks.length > 0 && (
              <div className="subtask-list">
                <ul>
                  {task.subTasks.map((subTask) => (
                    <li key={subTask.id} className="subtask-item">
                      <span
                        onClick={() =>
                          toggleSubTaskComplete(task.id, subTask.id)
                        }
                        style={{
                          textDecoration: subTask.completed
                            ? "line-through"
                            : "none",
                          cursor: "pointer",
                        }}
                      >
                        {subTask.text}
                      </span>
                      <button
                        className="delete-button"
                        onClick={() => deleteSubTask(task.id, subTask.id)}
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Modale per aggiungere un sotto-task */}
      {showModal && (
        <Modal
          show={showModal}
          onClose={handleCloseModal}
          onAddSubTask={addSubTask}
          taskId={selectedTaskId}
        />
      )}
    </div>
  );
}

export default TodoApp;
