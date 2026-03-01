import React, { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../Components/Loader";

export default function JournalList() {
  const [journals, setJournals] = useState([]);
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_URL;
  const navigate = useNavigate();

  const fetchJournals = async () => {
    try {
      const res = await axios.get(`${API}/journal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJournals(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        background: "#ccccea",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(20px, 4vw, 28px)",
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
          }}
        >
          📝 Journals List
        </h2>

        <div style={{ textAlign: "center" }}>
          <Link to="/journal">
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#8A2BE2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
                maxWidth: "260px",
              }}
            >
              Back to Journal Editor
            </button>
          </Link>
        </div>
      </div>

      {/* Cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {journals.map((j) => (
          <div
            key={j.id}
            style={{
              width: "100%",
              maxWidth: "320px",
              background: "#fff",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                📅 {new Date(j.created_at).toLocaleDateString()}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  marginTop: "10px",
                  maxHeight: "80px",
                  overflow: "hidden",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(j.content),
                }}
              />

              {/* Media Preview */}
              {j.journal_media &&
                j.journal_media.map((m) => (
                  <div key={m.id} style={{ marginTop: "10px" }}>
                    {m.type === "image" && (
                      <img
                        src={m.url}
                        alt="journal"
                        style={{
                          width: "100%",
                          height: "auto",
                          maxHeight: "200px",
                          objectFit: "cover",
                          borderRadius: "10px",
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
                          maxHeight: "200px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    )}
                  </div>
                ))}
            </div>

            <button
              onClick={() => navigate(`/journal/${j.journal_id}`)}
              style={{
                marginTop: "15px",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                background: "#8A2BE2",
                color: "white",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Read More ✨
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}