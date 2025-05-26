const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// Twilio config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// In-memory messages store
let messages = [];

// Helper function for message structure
function addMessage({ from, to, body, status }) {
  messages.push({
    from,
    to,
    body,
    status,
    timestamp: new Date().toLocaleString()
  });
  if (messages.length > 50) messages = messages.slice(-50); // limit history
}

// API to send SMS
app.post('/api/send', async (req, res) => {
  const { to, body } = req.body;
  if (!to || !body) {
    return res.status(400).json({ success: false, error: 'Recipient and message required.' });
  }
  try {
    const message = await client.messages.create({
      body,
      from: twilioPhone,
      to
    });
    addMessage({ from: twilioPhone, to, body, status: 'sent' });
    res.json({ success: true, sid: message.sid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API to get message history
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

// Twilio webhook for receiving SMS
app.post('/sms', (req, res) => {
  const from = req.body.From;
  const to = req.body.To;
  const body = req.body.Body;
  addMessage({ from, to, body, status: 'received' });
  res.set('Content-Type', 'text/xml');
  res.send('<Response><Message>Thank you for your message!</Message></Response>');
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
