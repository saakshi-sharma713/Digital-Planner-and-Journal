import React, { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";
import { Link } from "react-router-dom";
export default function JournalList() {
  const [journals, setJournals] = useState([]);
  const token = localStorage.getItem("token");
  const API = "http://localhost:8990/journal";
  const navigate = useNavigate();
  
  const fetchJournals = async () => {
    try {
      const res = await axios.get(API, {
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
        padding: "40px",
        background: "#ccccea",
        minHeight: "100vh",
      }}
    >
      

<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
  <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#333" }}>
    📝 Journals List
  </h2>

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
      }}
    >
      Back to Journal Editor
    </button>
  </Link>
</div>
{
    
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
              width: "280px",
              height: "420px",
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
                          height: "140px",
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
                          height: "140px",
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
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                background: "#8A2BE2",
                color: "white",
                cursor: "pointer",
              }}
            >
              Read More ✨
            </button>
          </div>
        ))}
      </div>
}
    </div> 
  );
}