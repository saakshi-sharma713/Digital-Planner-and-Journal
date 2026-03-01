import React, { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { useParams, useNavigate, Link } from "react-router-dom";
import Loader from "../Components/Loader";

export default function JournalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_URL;

  const fetchJournal = async () => {
    try {
      const res = await axios.get(`${API}/journal/${id}`, {
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
      await axios.delete(`${API}/journal/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/journals");
    } catch (err) {
      console.log(err);
    }
  };

  if (!journal) return <Loader />;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eaf4ff",
        display: "flex",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          width: "100%",
          maxWidth: "900px",
          padding: "clamp(20px, 5vw, 50px)",
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
            marginBottom: "20px",
            fontSize: "clamp(12px, 2vw, 16px)",
          }}
        >
          {new Date(journal.created_at).toLocaleDateString()}
        </div>

        {/* Content */}
        <div
          style={{
            fontSize: "clamp(14px, 2.5vw, 18px)",
            wordBreak: "break-word",
          }}
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
                        height: "auto",
                        maxHeight: "500px",
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
                        height: "auto",
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
            fontSize: "clamp(14px, 2vw, 18px)",
          }}
        >
          — My Thoughts 💙
        </div>

        {/* Delete Button */}
        <button
          onClick={deleteJournal}
          style={{
            marginTop: "30px",
            padding: "12px 25px",
            background: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "clamp(14px, 2vw, 16px)",
            width: "100%",
            maxWidth: "250px",
          }}
        >
          Delete Journal 🗑️
        </button>

        <button
          style={{
            marginTop: "30px",
            padding: "12px 25px",
            background: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "clamp(14px, 2vw, 16px)",
            width: "100%",
            maxWidth: "250px",
            marginLeft:"10px"
          }}
        >
          <Link to="/journal">Back to List</Link> 
        </button>
      </div>
    </div>
  );
}