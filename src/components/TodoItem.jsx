import React from "react";

const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <li
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "0.5rem",
        textDecoration: todo.completed ? "line-through" : "none",
      }}
    >
      <span onClick={() => onToggle(todo.id)} style={{ cursor: "pointer" }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>❌</button>
    </li>
  );
};

export default TodoItem;
