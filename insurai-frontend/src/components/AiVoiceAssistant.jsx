import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AiVoiceAssistant = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const toggleChat = () => {
    setOpen(!open);

    if (!open && messages.length === 0) {
      setMessages([
        { role: "assistant", text: "Hello! How can I help you today?" },
      ]);
    }
  };

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";

  const startListening = () => {
    console.log("Started listening");
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    console.log("Stopped listening");
    setIsListening(false);
    recognition.stop();
  };

  recognition.onend = () => {
    console.log("Recognition ended automatically");
    setIsListening(false);
  };

  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript;
    console.log("Recognized Text:", text);

    setMessages((prev) => [...prev, { role: "user", text }]);
    // Stop listening once result returned
    stopListening();
    console.log(user.email);

    const res = await fetch("http://localhost:8080/api/ai/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        message: text,
        email: user.email, // 👈 pass current logged-in user
      }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: data.responseText, data: data.data || [] },
    ]);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition"
      >
        🎤
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white shadow-xl rounded-xl p-4 border">
          <h3 className="font-bold text-lg mb-2">AI Insurance Assistant</h3>

          <div className="h-60 overflow-y-auto space-y-2 mb-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  m.role === "user"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p>{m.text}</p>

                {/* If AI returned structured data, map it */}
                {m.data && m.data.length > 0 && (
                  <ul className="mt-2 ml-3 list-disc text-sm text-gray-700">
                    {m.data.map((item, idx) => (
                      <li key={idx}>
                        {/* If it's a slot */}
                        {"startTime" in item
                          ? `${item.date} — ${item.startTime} to ${item.endTime}`
                          : /* If it's a policy */
                          "premium" in item
                          ? `${item.name} — Premium: $${item.premium}, Coverage: $${item.coverage}`
                          : /* Else assume agent */
                            `${item.name} (${item.email})`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-full py-2 rounded-lg ${
              isListening ? "bg-red-600" : "bg-blue-600"
            } text-white`}
          >
            {isListening ? "Stop Listening" : "Start Speaking"}
          </button>
        </div>
      )}
    </>
  );
};

export default AiVoiceAssistant;
