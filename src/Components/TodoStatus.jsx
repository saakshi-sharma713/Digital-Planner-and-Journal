import React, { useEffect, useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_URL;

export default function TodoAnalyticsTable() {
  const [todos, setTodos] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API}/todo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const workCompleted = todos.filter((t) => t.type === "work" && t.status)
    .length;
  const workPending = todos.filter((t) => t.type === "work" && !t.status)
    .length;
  const personalCompleted = todos.filter(
    (t) => t.type === "personal" && t.status
  ).length;
  const personalPending = todos.filter(
    (t) => t.type === "personal" && !t.status
  ).length;

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      

      <div className="overflow-x-auto">
        <table className="w-full min-w-[450px] border border-gray-300 rounded-lg h-96 md:h-[400px] text-2xl">
          <thead className="bg-gray-100">
            <tr>
              <th className={cell}>Type</th>
              <th className={cell}>Completed</th>
              <th className={cell}>Pending</th>
              <th className={cell}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-white even:bg-gray-50">
              <td className={cell}>
                <b>Work</b>
              </td>
              <td className={cell}>{workCompleted}</td>
              <td className={cell}>{workPending}</td>
              <td className={cell}>{workCompleted + workPending}</td>
            </tr>

            <tr className="odd:bg-white even:bg-gray-50">
              <td className={cell}>
                <b>Personal</b>
              </td>
              <td className={cell}>{personalCompleted}</td>
              <td className={cell}>{personalPending}</td>
              <td className={cell}>{personalCompleted + personalPending}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cell =
  "border border-gray-300 px-4 py-2 text-center  md:text-base whitespace-nowrap ";