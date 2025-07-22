import { useEffect, useState } from 'react';

const App = () => {
  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    await fetch('http://localhost:5000/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name, comment }),
});

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/add-comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    setText('');
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Comment Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment"
          required
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Comments</h3>
      <ul>
        {comments.map((c, i) => (
          <li key={i}>{c.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
