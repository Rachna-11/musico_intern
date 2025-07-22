import React, { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import "./App.css";

const API_BASE = "http://localhost:3000";

function App() {
  const [comments, setComments] = useState([]);

  const loadComments = async () => {
    const res = await fetch(`${API_BASE}/comments`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    loadComments();
  }, []);

  return (
    <div className="app">
      <h2>Leave a Comment</h2>
      <CommentForm reload={loadComments} />
      <h2>All Comments</h2>
      <div id="comments">
        <CommentList comments={comments} reload={loadComments} />
      </div>
    </div>
  );
}

export default App;
