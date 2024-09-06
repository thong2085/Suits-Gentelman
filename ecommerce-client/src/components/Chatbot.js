import React, { useState, useRef, useEffect } from "react";
import { FiMessageSquare, FiX, FiSend } from "react-icons/fi";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (userInput.trim()) {
      setMessages([...messages, { text: userInput, sender: "user" }]);
      setIsLoading(true);
      handleBotResponse(userInput);
      setUserInput("");
    }
  };

  const handleBotResponse = (input) => {
    setIsTyping(true);
    setTimeout(() => {
      let botReply = "Xin lỗi, tôi không hiểu câu hỏi của bạn.";

      if (input.toLowerCase().includes("giá")) {
        botReply = "Bạn có thể xem giá sản phẩm trên trang chi tiết sản phẩm.";
      } else if (input.toLowerCase().includes("giao hàng")) {
        botReply = "Chúng tôi giao hàng trong vòng 3-5 ngày làm việc.";
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botReply, sender: "bot" },
      ]);
      setIsLoading(false);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition duration-300"
        >
          <FiMessageSquare size={24} />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 overflow-hidden">
          <div className="bg-accent text-white p-4 flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">Chat hỗ trợ</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition duration-300"
            >
              <FiX size={24} />
            </button>
          </div>
          <div className="h-96 overflow-y-auto p-4 bg-gray-100">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
                  } shadow`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="text-left">
                <span className="inline-block p-2 rounded-lg bg-white text-gray-500 shadow animate-pulse">
                  Đang nhập...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tin nhắn..."
              />
              <button
                onClick={handleSend}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition duration-300"
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
