export default function CommentForm({ reload }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const message = form.message.value;

    await fetch("http://localhost:3000/add-comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message })
    });

    form.reset();
    reload();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Your name" required />
      <textarea name="message" placeholder="Your comment" required></textarea>
      <button type="submit">Post Comment</button>
    </form>
  );
}
