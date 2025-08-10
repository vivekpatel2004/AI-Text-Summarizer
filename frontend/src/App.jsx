import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  // Use env variable for backend URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSummarize = async () => {
    if (!text.trim()) return alert("Please enter some text.");
    setLoading(true);
    setCopied(false);
    setError(null);

    try {
      const res = await axios.post(`${BACKEND_URL}/summarize`, { text });
      setSummary(res.data.summary);
      // Optional: Comment next line if you want to keep input text after summarizing
      setText("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    }

    setLoading(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy summary to clipboard.");
    }
  };

  return (
    <div className="app-wrapper">
      <header>
        <h1>🧠 AI Text Summarizer</h1>
        <p>Summarize your content instantly using AI</p>
      </header>

      <main>
        <textarea
          placeholder="Paste your article, blog post, or paragraph here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          aria-label="Input text to summarize"
        />

        <button onClick={handleSummarize} disabled={loading}>
          {loading ? "⏳ Summarizing..." : "⚡ Generate Summary"}
        </button>

        {error && <p className="error-message">{error}</p>}

        {summary && (
          <div className="summary-container">
            <div className="summary-header">
              <h3>📝 Summary:</h3>
              <button
                onClick={handleCopy}
                className="copy-btn"
                aria-label="Copy summary to clipboard"
              >
                {copied ? "✅ Copied" : "📋 Copy"}
              </button>
            </div>
            <p>{summary}</p>
          </div>
        )}
      </main>

      <footer>
        <p>🚀 Built with React & HuggingFace | © 2025</p>
      </footer>
    </div>
  );
}

export default App;
