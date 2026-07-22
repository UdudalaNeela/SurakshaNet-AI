"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquareText, Send, User, Bot, Globe } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { fetchWithAuth } from "@/lib/auth";

export default function Copilot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Namaste! I am the SurakshaNet AI Copilot. I can help you identify scams, understand cyber threats, and guide you on how to report them. Please tell me what happened.",
      language: "en",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState("en");

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", content: userMsg, language }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetchWithAuth("/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, language })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "bot", content: data.reply, language }]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", content: "Sorry, I am facing some issues connecting to the server.", language }]);
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { role: "bot", content: "Network error occurred.", language }]);
    }
    
    setIsTyping(false);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquareText className="w-8 h-8 text-primary" />
            Citizen AI Copilot
          </h2>
          <p className="text-muted-foreground mt-2">
            Multilingual AI assistant powered by Gemini to help citizens understand and prevent cyber fraud.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 border border-border/50 px-3 py-1.5 rounded-lg">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-sm focus:outline-none text-foreground font-medium"
          >
            <option value="en">English</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="kn">Kannada (ಕನ್ನಡ)</option>
            <option value="te">Telugu (తెలుగు)</option>
          </select>
        </div>
      </div>

      <Card className="flex-1 bg-background/40 backdrop-blur-sm border-border/50 flex flex-col overflow-hidden">
        <CardContent className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <Avatar className={`w-10 h-10 flex items-center justify-center ${msg.role === "user" ? "bg-primary/20 text-primary" : "bg-gradient-to-br from-blue-500 to-purple-500 text-white"}`}>
                {msg.role === "user" ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </Avatar>
              <div className={`max-w-[70%] p-4 rounded-2xl ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-sm" 
                  : "bg-muted/50 border border-border/50 text-foreground rounded-tl-sm"
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </Avatar>
              <div className="bg-muted/50 border border-border/50 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </CardContent>
        
        <div className="p-4 border-t border-border/50 bg-background/50">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything... (e.g. Someone says he is from CBI)"
              className="w-full bg-muted border border-border rounded-full pl-6 pr-14 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
