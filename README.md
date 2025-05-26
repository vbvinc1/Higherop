# SMS Chat App (Twilio + Node.js + Modern UI)

A modern, responsive web SMS chat app using Twilio, Node.js, and Express.  
Send and receive SMS in a beautiful chat interface—perfect for demos, learning, or village business!

## Features

- Send and receive SMS (Twilio API)
- Advanced chat UI (chat bubbles, timestamps, responsive design)
- Robust error handling and user feedback
- In-memory message history (demo)
- Ready for deployment on Render, Vercel, or Heroku

## Setup

1. Clone this repo:
    ```
    git clone https://github.com/your-username/sms-chat-app.git
    cd sms-chat-app
    ```

2. Install dependencies:
    ```
    npm install
    ```

3. Copy `.env.example` to `.env` and fill in your Twilio credentials:
    ```
    TWILIO_ACCOUNT_SID=your_account_sid_here
    TWILIO_AUTH_TOKEN=your_auth_token_here
    TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
    ```

4. Start the app:
    ```
    npm start
    ```
    App runs at [http://localhost:3000](http://localhost:3000)

## Deployment

### **Render.com**
- Create a new "Web Service"
- Connect this GitHub repo
- Set environment variables from `.env`
- Build command: (leave blank or `npm install`)
- Start command: `npm start`

### **Vercel/Heroku**
- Deploy as Node.js app, set env variables

## Twilio Webhook

- In your [Twilio Console](https://console.twilio.com/), set the "A MESSAGE COMES IN" webhook to:
    ```
    https://your-app-url.onrender.com/sms
    ```

## Notes

- This demo stores messages in memory (not persistent).  
  For production, connect a database (MongoDB, Postgres, Firebase, etc.).

- For help, contact Vishnu or open an issue!

---
