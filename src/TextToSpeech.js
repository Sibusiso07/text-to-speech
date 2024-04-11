import React, { useState } from 'react';

const TextToSpeechApp = () => {
  const [text, setText] = useState('');
  
  const splitText = (text) => {
    return text.match(/[^\.!\?,]+[\.!\?,]+/g) || [];
  };

  const speakTextChunk = (textChunk) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(textChunk);
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const speakTextInQueue = async (text) => {
    const sentences = splitText(text);
    for (let sentence of sentences) {
      await speakTextChunk(sentence.trim());
      const lastChar = sentence.trim().slice(-1);
      const pauseDuration = lastChar === ',' ? 500 : 1000; // Pause for 500ms for comma, 1000ms for others
      await new Promise(resolve => setTimeout(resolve, pauseDuration));
    }
  };

  const speak = () => {
    if ('speechSynthesis' in window) {
      speakTextInQueue(text);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div>
      <h1>Text to Speech App</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
      />
      <div>
        <button onClick={speak}>Speak</button>
        <button onClick={stopReading}>Stop</button>
      </div>
    </div>
  );
};

export default TextToSpeechApp;
