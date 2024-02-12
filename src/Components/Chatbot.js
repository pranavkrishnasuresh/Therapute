import React, { useState } from 'react';
import "./Chatbot.css"
// const OpenAI = require("openai").OpenAI;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);

  const handleMessageSend = async (messageText) => {
    // Add user message to the chat interface
    setMessages((prevMessages) => [...prevMessages, { text: messageText, sender: 'user' }]);

    // Send the user message to the chatbot API (assuming you have a function to handle this)
    // const botResponse = await sendMessageToChatbot(messageText);

    // Add bot response to the chat interface
    // setMessages((prevMessages) => [...prevMessages, { text: botResponse, sender: 'bot' }]);
  };

  // const prompt1 = "What was your overall experience with this exercise?"
  // const prompt2 = "Share some notable changes or insights you've experienced since using Therapute."
  // const prompt3 = "How do you think the insights you gained from using Therapute have impacted your daily life?"

  // const openai = new OpenAI();
  // const GPTresponse = openai.chat.completions.create({
  //   model: "gpt-3.5-turbo",
  //   messages: [
  //     {
  //       role: "user",
  //       content: prompt,
  //     }
  //   ],
  //   max_tokens: 5, 
  // });

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Type your message here..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleMessageSend(e.target.value);
              e.target.value = '';
            }
          }}
        />
        <button
          onClick={() => {
            const messageInput = document.querySelector('.chatbot-input input');
            handleMessageSend(messageInput.value);
            messageInput.value = '';
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
