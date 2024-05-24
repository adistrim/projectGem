"use client";
import React, { useState, useRef, useEffect } from 'react';
import * as marked from 'marked';

const ChatApp = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash-latest');
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (userInput.trim() === '') return;

        setMessages((prevMessages) => [
            ...prevMessages,
            { text: userInput, sender: 'user' },
        ]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: userInput, model: selectedModel }),
            });

            const data = await response.json();

            setMessages((prevMessages) => [
                ...prevMessages,
                { text: data.response, sender: 'ai', response: data.response },
            ]);
        } catch (error) {
            console.error('Error:', error);
        }

        setUserInput('');
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
    };

    const renderMarkdown = (markdownText) => {
        const html = marked.parse(markdownText);
        return { __html: html };
    };    

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#343541', color: '#fff' }}>
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px',
                    overflowY: 'auto',
                }}
                ref={chatContainerRef}
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            marginBottom: '15px',
                            padding: '10px',
                            borderRadius: '8px',
                            maxWidth: '70%',
                            wordWrap: 'break-word',
                            backgroundColor: message.sender === 'user' ? '#2a2b32' : '#444654',
                            alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                        }}
                    >
                        {message.sender === 'user' ? (
                            <p style={{ color: '#d1d5db', fontSize: '0.9em', margin: 0 }}>{message.text}</p>
                        ) : (
                            <div dangerouslySetInnerHTML={renderMarkdown(message.response)} />
                        )}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: '#40414f' }}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '4px',
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        backgroundColor: '#343541',
                        color: '#fff',
                    }}
                />
                <button
                    onClick={sendMessage}
                    style={{
                        padding: '10px 20px',
                        color: '#000000b5',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                        outline: 'none',
                        fontSize: '16px',
                        marginLeft: '10px',
                    }}
                >
                    Send
                </button>
                <select
                    value={selectedModel}
                    onChange={handleModelChange}
                    style={{
                        padding: '10px',
                        borderRadius: '4px',
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        backgroundColor: '#343541',
                        color: '#fff',
                        marginLeft: '10px',
                    }}
                >
                    <option value="gemini-1.0-pro">Gemini 1.0 Pro</option>
                    <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash</option>
                    <option value="gemini-1.5-pro-latest">Gemini 1.5 Pro</option>
                </select>
            </div>
            <div style={{ backgroundColor: '#40414f', textAlign: 'center', fontSize: '12px' }}>
                <p style={{ color: '#c7c7c7' }}>
                    <a
                        href="https://ai.google.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#d1d5db', textDecoration: 'none' }}
                    >
                        Gemini API
                    </a>{' '}
                    may create unexpected outputs, please verify before proceeding. This UI is prepared by{' '}
                    <a
                        href="https://www.adistrim.me"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#d1d5db', textDecoration: 'none' }}
                    >
                        adistrim
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ChatApp;
