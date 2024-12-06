"use client";

import { useState, useEffect } from "react";
import {
  FaPencilAlt,
  FaTrashAlt,
  FaPlus,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

import { api } from "@/trpc/react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string | Date;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("All");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const { data: tasks, refetch } = api.task.getAll.useQuery();
  const createTask = api.task.create.useMutation({
    onSuccess: () => refetch(),
  });
  const updateTask = api.task.update.useMutation({
    onSuccess: () => refetch(),
  });
  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => refetch(),
  });

  // Fetch tasks on mount
  useEffect(() => {
    if (tasks) {
      setTodos(tasks);
    }
  }, [tasks]);

  const addTodo = async () => {
    if (!newTask.trim()) return;

    await createTask.mutateAsync({ title: newTask });
    setNewTask("");
    setIsAdding(false);
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;

    await updateTask.mutateAsync({
      id,
      title: todo.title,
      completed: !completed,
    });
  };

  const deleteTodo = async (id: number) => {
    await deleteTask.mutateAsync({ id });
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async () => {
    if (editingId === null) return;

    await updateTask.mutateAsync({
      id: editingId,
      title: editText,
      completed:
        todos.find((todo) => todo.id === editingId)?.completed || false,
    });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "Active") return !todo.completed;
    if (filter === "Completed") return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-center text-4xl font-bold text-[#6B7280]">
          TODO LIST
        </h1>

        <div className="mb-6 flex items-center justify-between">
          {isAdding ? (
            <div className="mr-4 flex-1">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter new task"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center rounded-lg bg-[#6366F1] px-6 py-2 text-white transition-colors hover:bg-[#5558DD]"
            >
              <FaPlus className="mr-2 h-5 w-5" />
              Add Task
            </button>
          )}

          {isAdding && (
            <button
              onClick={addTodo}
              className="rounded-lg bg-[#6366F1] px-6 py-2 text-white transition-colors hover:bg-[#5558DD]"
            >
              Add
            </button>
          )}

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg bg-gray-200 px-4 py-3 text-gray-700 outline-none"
          >
            <option>All</option>
            <option>Active</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="space-y-2 rounded-2xl bg-[#F3F4F6] p-4">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center rounded-xl bg-white p-4 shadow-sm"
            >
              <div
                onClick={() => toggleTodo(todo.id, todo.completed)}
                className={`mr-4 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border-2 ${
                  todo.completed
                    ? "border-[#6366F1] bg-[#6366F1]"
                    : "border-gray-300 hover:border-[#6366F1]"
                }`}
              >
                {todo.completed && <FaCheck className="h-3 w-3 text-white" />}
              </div>

              <div className="flex-1">
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    onKeyUp={(e) => e.key === "Enter" && saveEdit()}
                  />
                ) : (
                  <>
                    <p
                      className={`text-gray-800 ${
                        todo.completed ? "text-gray-400 line-through" : ""
                      }`}
                    >
                      {todo.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      {new Date(todo.createdAt).toLocaleString("en-US")}
                    </p>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {editingId === todo.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="rounded-lg p-2 text-green-500 hover:text-green-600"
                    >
                      <FaCheck className="h-5 w-5" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="rounded-lg p-2 text-red-500 hover:text-red-600"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(todo.id, todo.title)}
                      className="rounded-lg p-2 text-gray-400 hover:text-gray-600"
                    >
                      <FaPencilAlt className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="rounded-lg p-2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTrashAlt className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
