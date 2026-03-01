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

  // 🔥 Calculate counts
  const workCompleted = todos.filter(
    (t) => t.type === "work" && t.status
  ).length;

  const workPending = todos.filter(
    (t) => t.type === "work" && !t.status
  ).length;

  const personalCompleted = todos.filter(
    (t) => t.type === "personal" && t.status
  ).length;

  const personalPending = todos.filter(
    (t) => t.type === "personal" && !t.status
  ).length;

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h2 style={{ textAlign: "center" }}>📊 Productivity Overview</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th style={cell}>Type</th>
            <th style={cell}>Completed</th>
            <th style={cell}>Pending</th>
            <th style={cell}>Total</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={cell}><b>Work</b></td>
            <td style={cell}>{workCompleted}</td>
            <td style={cell}>{workPending}</td>
            <td style={cell}>{workCompleted + workPending}</td>
          </tr>

          <tr>
            <td style={cell}><b>Personal</b></td>
            <td style={cell}>{personalCompleted}</td>
            <td style={cell}>{personalPending}</td>
            <td style={cell}>{personalCompleted + personalPending}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const cell = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "center",
};