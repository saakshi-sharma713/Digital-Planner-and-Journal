// TodoCard.jsx
import React from "react";

const TodoCard = ({ todo, toggleTodo, deleteTodo, getTodoClasses, getPriorityBadge }) => {
  return (
    <div
      className={`flex flex-col p-4 mb-3 rounded-lg border shadow-sm transition h-auto ${getTodoClasses(todo)}`}
    >
      {/* Badge container (top-right) */}
      <div className="flex justify-start mb-2">
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-lg ${getPriorityBadge(
            todo.priority
          )}`}
        >
          {todo.priority || "none"}
        </span>
      </div>

      {/* Content container (checkbox + title + delete) */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={todo.status}
            onChange={() => toggleTodo(todo)}
          />
          <span
            className={`cursor-pointer ${
              todo.status ? "line-through text-green-700" : "text-black"
            }`}
          >
            {todo.title}
          </span>
        </div>

        <button
          onClick={() => deleteTodo(todo.id)}
          className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold hover:bg-red-600 transition"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default TodoCard;