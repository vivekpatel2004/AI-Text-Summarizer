import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use env variable for backend URL
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // for Create React App
  // If you use Vite, replace the above line with:
  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSummarize = async () => {
    if (!text.trim()) return alert("Please enter some text.");
    setLoading(true);
    setCopied(false);

    try {
      const res = await axios.post(`${BACKEND_URL}/summarize`, {
        text,
      });
      setSummary(res.data.summary);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again later.");
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        />

        <button onClick={handleSummarize} disabled={loading}>
          {loading ? "⏳ Summarizing..." : "⚡ Generate Summary"}
        </button>

        {summary && (
          <div className="summary-container">
            <div className="summary-header">
              <h3>📝 Summary:</h3>
              <button onClick={handleCopy} className="copy-btn">
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
