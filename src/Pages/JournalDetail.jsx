import React, { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { useParams, useNavigate } from "react-router-dom";

export default function JournalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const token = localStorage.getItem("token");
  const API = "http://localhost:8990/journal";

  const fetchJournal = async () => {
    try {
      const res = await axios.get(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJournal(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchJournal();
  }, [id]);

  const deleteJournal = async () => {
    if (!window.confirm("Delete this journal?")) return;

    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/journals");
    } catch (err) {
      console.log(err);
    }
  };

  if (!journal) return <p>Loading...</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eaf4ff",
        display: "flex",
        justifyContent: "center",
        padding: "50px",
      }}
    >
      <div
        style={{
          background: "white",
          width: "700px",
          padding: "50px",
          borderRadius: "12px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
          fontFamily: "Georgia, serif",
          lineHeight: "1.8",
          color: "#1e3a5f",
        }}
      >
        {/* Date */}
        <div
          style={{
            textAlign: "right",
            color: "#4a6fa5",
            marginBottom: "30px",
          }}
        >
          {new Date(journal.created_at).toLocaleDateString()}
        </div>

        {/* Content */}
        <div
          style={{ fontSize: "18px" }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(journal.content),
          }}
        />

        {/* MEDIA SECTION */}
        {journal.journal_media &&
          journal.journal_media.length > 0 && (
            <div style={{ marginTop: "30px" }}>
              {journal.journal_media.map((m) => (
                <div key={m.id} style={{ marginBottom: "20px" }}>
                  {m.type === "image" && (
                    <img
                      src={m.url}
                      alt="journal"
                      style={{
                        width: "100%",
                        maxHeight: "400px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        border: "3px solid #4a90e2",
                      }}
                    />
                  )}

                  {m.type === "video" && (
                    <video
                      src={m.url}
                      controls
                      style={{
                        width: "100%",
                        borderRadius: "12px",
                        border: "3px solid #4a90e2",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

        {/* Signature */}
        <div
          style={{
            marginTop: "40px",
            textAlign: "right",
            color: "#4a6fa5",
            fontStyle: "italic",
          }}
        >
          — My Thoughts 💙
        </div>

        {/* Delete Button */}
        <button
          onClick={deleteJournal}
          style={{
            marginTop: "40px",
            padding: "10px 25px",
            background: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Delete Journal 🗑️
        </button>
      </div>
    </div>
  );
}