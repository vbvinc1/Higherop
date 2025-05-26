const messagesDiv = document.getElementById('messages');
const form = document.getElementById('smsForm');
const statusDiv = document.getElementById('status');
const loader = document.getElementById('loader');
const chatWindow = document.getElementById('chat-window');

function showStatus(msg, error = false) {
  statusDiv.style.color = error ? '#c62828' : '#388e3c';
  statusDiv.innerText = msg;
  setTimeout(() => { statusDiv.innerText = ''; }, 4000);
}

function renderMessages(messages) {
  messagesDiv.innerHTML = '';
  messages.slice().reverse().forEach(msg => {
    const div = document.createElement('div');
    div.className = 'message ' + (msg.status === 'sent' ? 'sent' : 'received');
    div.innerHTML = `
      <div class="bubble">${msg.body}</div>
      <div class="meta">
        ${msg.status === 'sent' ? 'You' : msg.from} &bull; ${msg.timestamp}
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
    showStatus('Failed to load messages.', true);
  } finally {
    loader.style.display = 'none';
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const to = form.to.value.trim();
  const body = form.body.value.trim();
  if (!/^\+\d{10,15}$/.test(to)) {
    showStatus('Enter valid phone in +911234567890 format.', true);
    return;
  }
  loader.style.display = '';
  form.body.disabled = true;
  form.to.disabled = true;
  form.sendBtn.disabled = true;
  try {
    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, body })
    });
    const data = await res.json();
    if (data.success) {
      showStatus('Message sent!');
      form.body.value = '';
      await fetchMessages();
    } else {
      showStatus('Send failed: ' + data.error, true);
    }
  } catch (err) {
    showStatus('Failed to send: Network error', true);
  } finally {
    loader.style.display = 'none';
    form.body.disabled = false;
    form.to.disabled = false;
    form.sendBtn.disabled = false;
  }
});

// Poll messages every 5 seconds
setInterval(fetchMessages, 5000);
fetchMessages(true);
