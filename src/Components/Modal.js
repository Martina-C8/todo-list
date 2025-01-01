import React, { useState } from 'react';
import "../Styles/Modal.css";  // Aggiungi uno stile per il modale

function Modal({ show, onClose, onAddSubTask, taskId }) {
  const [newSubTask, setNewSubTask] = useState("");

  const handleAddSubTask = () => {
    if (newSubTask.trim() !== "") {
      onAddSubTask(taskId, newSubTask);
      setNewSubTask(""); // Reset input
      onClose(); // Chiude il modale
    }
  };

  if (!show) return null; // Non mostrare il modale se `show` è falso

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Aggiungi un sotto-task</h3>
        <input
          type="text"
          value={newSubTask}
          onChange={(e) => setNewSubTask(e.target.value)}
          placeholder="Descrizione sotto-task"
        />
        <button onClick={handleAddSubTask}>Aggiungi</button>
        <button onClick={onClose}>Chiudi</button>
      </div>
    </div>
  );
}

export default Modal;
