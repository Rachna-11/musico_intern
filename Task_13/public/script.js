async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  const messagesDiv = document.getElementById("messages");

  const userMsg = document.createElement("div");
  userMsg.className = "msg user";
  userMsg.innerHTML = `<b>You:</b> ${message}`;
  messagesDiv.appendChild(userMsg);
  input.value = "";

  const typingMsg = document.createElement("div");
  typingMsg.className = "msg bot";
  typingMsg.id = "typing";
  typingMsg.innerHTML = `<i>AI is typing...</i>`;
  messagesDiv.appendChild(typingMsg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    typingMsg.remove();

    const botMsg = document.createElement("div");
    botMsg.className = "msg bot fade-in";
    botMsg.innerHTML = `<b>AI:</b> ${data.reply}`;
    messagesDiv.appendChild(botMsg);

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (err) {
    typingMsg.remove();
    messagesDiv.innerHTML += `<div class="msg bot"><b>AI:</b> Error getting response.</div>`;
  }
}
