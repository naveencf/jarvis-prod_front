import { useEffect, useState } from "react";
import io from "socket.io-client";

// const socket = io("http://localhost:5000"); // Replace with your backend URL

export default function PantryUserDashboard() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        // Listening for messages from server
        socket.on("message", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("message"); // Clean up listener on unmount
        };
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            socket.emit("message", input); // Sending message to server
            setInput("");
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Socket.io Chat</h2>
            <div className="border p-2 h-40 overflow-y-auto mb-2">
                {messages.map((msg, index) => (
                    <p key={index} className="text-sm p-1 bg-gray-200 rounded my-1">{msg}</p>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border p-2 flex-1 rounded"
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">Send</button>
            </div>
        </div>
    );
}
