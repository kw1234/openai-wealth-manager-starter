import React, { useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const handleConnect = async () => {
    const res = await fetch("/api/connect/plaid");
    const { url } = await res.json();
    window.location.href = url;
  };

  const handleSend = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();
    setMessages([...messages, { role: "user", content: input }, data]);
    setInput("");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Wealth Manager</h1>
      {!connected ? (
        <Button onClick={handleConnect}>Connect Fidelity via Plaid</Button>
      ) : (
        <div>
          <div className="space-y-2 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                {msg.content}
              </div>
            ))}
          </div>
          <input
            className="border p-2 w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your account..."
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      )}
    </div>
  );
}

export default App;
