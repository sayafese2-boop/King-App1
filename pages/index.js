import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Yo, I'm KING AI. I see you're putting in the work. What's on your mind — training, life, or both?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <Head>
        <title>KING AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header style={{
        borderBottom: '1px solid rgba(255,215,0,0.3)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(0,0,0,0.5)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '20px',
          color: '#000'
        }}>K</div>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', color: '#FFD700' }}>KING AI</h1>
          <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Your Basketball Mentor</p>
        </div>
      </header>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: 'calc(100vh - 140px)',
        overflowY: 'auto'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '75%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user' 
                ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
                : 'rgba(255,255,255,0.08)',
              color: msg.role === 'user' ? '#000' : '#fff',
              fontSize: '15px',
              lineHeight: '1.5'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '16px 16px 16px 4px',
              background: 'rgba(255,255,255,0.08)',
              color: '#888'
            }}>Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px',
        borderTop: '1px solid rgba(255,215,0,0.2)',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          gap: '8px'
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to KING AI..."
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: '25px',
              border: '1px solid rgba(255,215,0,0.3)',
              background: 'rgba(255,255,255,0.06)',
              color: '#fff',
              fontSize: '15px',
              outline: 'none'
            }}
          />
          <button type="submit" disabled={loading} style={{
            padding: '14px 24px',
            borderRadius: '25px',
            border: 'none',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
