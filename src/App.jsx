import React, { useEffect, useState } from "react";
import AddTodo from "./components/AddTodo";
import Filter from "./components/Filter";
import TodoList from "./components/TodoList";

const FILTER_MAP = {
  all: () => true,
  completed: (todo) => todo.completed,
  pending: (todo) => !todo.completed,
};

const USER_ID = 1;

const App = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      setTodos(JSON.parse(stored));
    } else {
      fetchTodosFromAPI();
    }
    // eslint-disable-next-line
  }, []);

  const fetchTodosFromAPI = async () => {
    try {
      const res = await fetch(`https://dummyjson.com/todos/user/${USER_ID}`);
      const data = await res.json();
      const transformedTodos = data.todos.map((todo) => ({
        id: todo.id,
        text: todo.todo,
        completed: todo.completed,
      }));
      setTodos(transformedTodos);
      localStorage.setItem("todos", JSON.stringify(transformedTodos));
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = async (text) => {
    try {
      const res = await fetch("https://dummyjson.com/todos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todo: text,
          completed: false,
          userId: USER_ID,
        }),
      });
      const newTodo = await res.json();
      const formatted = {
        id: newTodo.id,
        text: newTodo.todo,
        completed: newTodo.completed,
      };
      setTodos([formatted, ...todos]);
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  const toggleTodo = async (id) => {
    const current = todos.find((t) => t.id === id);
    if (!current) return;

    try {
      const res = await fetch(`https://dummyjson.com/todos/1`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: !current.completed,
        }),
      });

      const updated = await res.json();

      setTodos(
        todos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                completed: updated.completed,
              }
            : todo
        )
      );
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`https://dummyjson.com/todos/1`, {
        method: "DELETE",
      });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  const filteredTodos = todos.filter(FILTER_MAP[filter]);

  return (
    <div className="app">
      <h1>📝 Todo List (with API)</h1>
      <AddTodo onAdd={addTodo} />
      <Filter current={filter} onChange={setFilter} />
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
};

export default App;
