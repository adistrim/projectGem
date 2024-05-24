"use client";
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './page.module.css';
import './globals.css';

const HomePage = () => {
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    const selectedModel = document.getElementById('model-select').value;
    document.getElementById('loading-spinner').style.display = 'block';

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: userInput, model: selectedModel }),
    });

    const data = await response.json();
    document.getElementById('loading-spinner').style.display = 'none';

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userInput, sender: 'user' },
      { text: data.response, sender: 'ai' },
    ]);

    document.getElementById('user-input').value = '';
  };

  return (
    <div>
      <div id="loading-spinner" className={styles.loadingSpinner}>
        <i className="fas fa-spinner fa-spin"></i>
      </div>
      <div className={styles.chatContainer}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${styles[`${message.sender}Message`]}`}>
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input type="text" id="user-input" placeholder="Type your message..." className={styles.input} />
        <button id="send-button" onClick={sendMessage} className={styles.button}>
          Send
        </button>
        <select id="model-select" className={styles.select}>
          <option value="gemini-1.0-pro">Gemini 1.0 Pro</option>
          <option value="gemini-1.5-flash-latest" selected>
            Gemini 1.5 Flash
          </option>
          <option value="gemini-1.5-pro-latest">Gemini 1.5 Pro</option>
        </select>
      </div>
      <div className={styles.footer}>
        <p>
          <a href="https://ai.google.dev" target="_blank" rel="noopener noreferrer">
            Gemini API
          </a>{' '}
          may create unexpected outputs, please verify before proceeding. This UI is prepared by{' '}
          <a href="https://www.adistrim.me" target="_blank" rel="noopener noreferrer">
            adistrim
          </a>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
