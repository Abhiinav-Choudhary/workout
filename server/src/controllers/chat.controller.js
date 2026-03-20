import {getBotResponse} from "../logic/bot.logic.js"

export const handleChat = (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.json({ reply: "Session error. Please refresh and try again." });
  }

  const reply = getBotResponse(message, sessionId);
  res.json({ reply });
};


