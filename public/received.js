const messagesDiv = document.getElementById('messages');
const loader = document.getElementById('loader');
const chatWindow = document.getElementById('chat-window');

function renderMessages(messages) {
  messagesDiv.innerHTML = '';
  const received = messages.filter(msg => msg.status === 'received');
  if (!received.length) {
    messagesDiv.innerHTML = '<div style="color:#888;text-align:center;margin-top:30px;">No received messages yet.</div>';
    return;
  }
  received.slice().reverse().forEach(msg => {
    const div = document.createElement('div');
    div.className = 'message received';
    div.innerHTML = `
      <div class="bubble">${msg.body}</div>
      <div class="meta">
        From: <strong>${msg.from}</strong> &bull; ${msg.timestamp}
      </div>
    `;
    messagesDiv.appendChild(div);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function fetchMessages(showLoading = false) {
  if (showLoading) loader.style.display = '';
  try {
    const res = await fetch('/api/messages');
    const messages = await res.json();
    renderMessages(messages);
  } catch {
    messagesDiv.innerHTML = '<div style="color:#c62828;text-align:center;margin-top:30px;">Failed to load messages.</div>';
  } finally {
    loader.style.display = 'none';
  }
}

// Poll messages every 7 seconds
setInterval(fetchMessages, 7000);
fetchMessages(true);
