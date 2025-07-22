export default function CommentList({ comments, reload }) {
  const handleReply = async (e, commentId) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const message = form.message.value;

    await fetch(`http://localhost:3000/add-reply/${commentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message })
    });

    form.reset();
    reload();
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    await fetch(`http://localhost:3000/delete-comment/${commentId}`, {
      method: "DELETE"
    });

    reload();
  };

  return (
    <ul id="commentList">
      {comments.map((c) => (
        <li key={c._id}>
          <strong>{c.name}</strong> {c.message}
          <ul>
            {(c.replies || []).map((r) => (
              <li key={r._id}>
                <em>{r.name}</em>: {r.message}
              </li>
            ))}
          </ul>
          <form onSubmit={(e) => handleReply(e, c._id)}>
            <input type="text" name="name" placeholder="Your name" required />
            <input type="text" name="message" placeholder="Your reply" required />
            <button type="submit">Reply</button>
          </form>
          <button className="delete-btn" onClick={() => deleteComment(c._id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
