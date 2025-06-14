import { useEffect, useState } from "react";
import AddTodo from "./components/AddTodo";
import Filter from "./components/Filter";
import TodoList from "./components/TodoList";

const FILTER_MAP = {
  all: () => true,
  completed: (todo) => todo.completed,
  pending: (todo) => !todo.completed,
};

const API_URL = "https://dummyjson.com/todos/user/26";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  // Load from localStorage and API on mount
  useEffect(() => {
    const loadTodos = async () => {
      let localTodos = [];
      try {
        const stored = localStorage.getItem("todos");
        if (stored) {
          const parsedTodos = JSON.parse(stored);
          if (Array.isArray(parsedTodos)) {
            localTodos = parsedTodos;
          }
        }
      } catch (error) {
        console.error("Error loading todos from localStorage:", error);
      }

      let apiTodos = [];
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (Array.isArray(data.todos)) {
          apiTodos = data.todos.map((todo) => ({
            id: todo.id,
            text: todo.todo,
            completed: todo.completed,
          }));
        }
      } catch (error) {
        console.error("Error loading todos from API:", error);
      }

      // Merge local and API todos, avoiding duplicates by id
      const allTodosMap = new Map();
      [...localTodos, ...apiTodos].forEach((todo) => {
        allTodosMap.set(todo.id, todo);
      });
      const mergedTodos = Array.from(allTodosMap.values());

      setTodos(mergedTodos);

      // Save merged todos to localStorage
      try {
        localStorage.setItem("todos", JSON.stringify(mergedTodos));
      } catch (error) {
        console.error("Error saving merged todos:", error);
      }
    };

    loadTodos();
  }, []);

  // Save to localStorage on todos change
  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  }, [todos]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter(FILTER_MAP[filter]);

  return (
    <div className="app">
      <h1>📝 Todo List</h1>
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
