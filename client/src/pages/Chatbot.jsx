import React, { useEffect, useState, useRef } from "react";

function Chatbot() {
   const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const sessionId = useRef(null);

  // ---------- SESSION ID (PERSISTENT) ----------
  useEffect(() => {
    let storedSessionId = localStorage.getItem("fitness_bot_session");

    if (!storedSessionId) {
      storedSessionId = crypto.randomUUID();
      localStorage.setItem("fitness_bot_session", storedSessionId);
    }

    sessionId.current = storedSessionId;
  }, []);

  // ---------- LOAD MESSAGES ----------
  useEffect(() => {
    const storedMessages = localStorage.getItem("fitness_bot_messages");

    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      setMessages([
        {
          sender: "bot",
          text: "Hey! 👋 I’m your personal fitness guide. What’s your goal today?"
        }
      ]);
    }
  }, []);

  // ---------- SAVE MESSAGES ----------
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        "fitness_bot_messages",
        JSON.stringify(messages)
      );
    }
  }, [messages]);

  // ---------- SEND MESSAGE ----------
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          sessionId: sessionId.current
        })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error. Please try again later." }
      ]);
    }
  };


  // ---------- RESET / START OVER ----------
const handleReset = () => {
  // Clear chat messages
  localStorage.removeItem("fitness_bot_messages");

  // Create a fresh session
  const newSessionId = crypto.randomUUID();
  localStorage.setItem("fitness_bot_session", newSessionId);
  sessionId.current = newSessionId;

  // Reset UI with fresh bot intro
  setMessages([
    {
      sender: "bot",
      text: "Hey! 👋 I’m your personal fitness guide. What’s your goal today?"
    }
  ]);
};


  return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4 flex flex-col">
      
      <h2 className="text-xl font-semibold text-center mb-1">
        Fitness Bot
      </h2>

     <div className="flex justify-end mb-2">
  <button
    onClick={handleReset}
    className="
      flex items-center gap-1
      text-xs text-gray-500
      px-2 py-1 rounded-md
      hover:text-red-500 hover:bg-red-50
      transition duration-150
    "
  >
    🔄 Reset
  </button>
</div>


      <div className="flex-1 border rounded-md p-3 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[80%] text-sm ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  </div>
);
}

export default Chatbot