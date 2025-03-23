"use client"
import React from "react";

import { useState, useEffect } from "react";

interface Todo {
  id: number;
  task: string;
}
export default function Home() {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/todos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTodos(data);
        } else {
          console.error("Error: Data is not an array", data);
          setTodos([]); 
        }
      })
      .catch((err) => console.error("Error fetching todos:", err));
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;
    const newTodo = { title: input };
    try {
      const res = await fetch("http://localhost:5001/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        setTodos([...todos, data]);
        setInput("");
      } else {
        console.error("Failed to add todo", data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };
  
  const deleteTodo = async (id: number) => {
    const res = await fetch(`http://localhost:5001/todos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">To-Do List</h1>

      <div className="flex">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add a new task..." className="border p-2 flex-grow rounded-l-md"/>
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600">
          Add
        </button>
      </div>

      <ul className="mt-4">
        {todos.map((todo) => (
            <li key={todo.id} className="flex justify-between p-2 border-b last:border-b-0">
            <span>{todo.task}</span> 
            <button onClick={() => deleteTodo(todo.id)} className="bg-red-500 text-white px-2 rounded hover:bg-red-600">Delete
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
}