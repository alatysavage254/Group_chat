// import  { useEffect, useRef, useState} from "react";

// export default function ChatRoom({ room, messages = [], user, socket }) {
//     const [chat, setChat] = useState("");
//     const [typingUser, setTypingUser] = useState('');
//     const msgRef = useRef(null);

//     useEffect(() => {
//         socket.on("typing", (username) => {
//             setTypingUser(username);
//         });

//         socket.on("stopTyping", () => {
//             setTypingUser("");
//         });

//         return () => {
//             socket.off("typing");
//             socket.off("stopTyping");
//         };
//     }, [socket]);

//     const handleTyping = () => {
//         socket.emit("typing");
//         setTimeout(() => socket.emit("stopTyping"), 1000);
//     };

//     const handleSend = () => {
//         socket.emit("sendMessage", chat);
//         setChat("");
//     };

//     return (
//         <div>
//             <h2 className="text-2xl mb-2">{room.name}</h2>
//             <div className="h-64 overflow-y-auto border mb-2 bg-gray-50" ref={msgRef}>
//                 {messages.map((msg) => (
//                     <p key={msg._id}>
//                         <strong>{msg.sender.username}:</strong> {msg.content}
//                     </p>
//                 ))}
//             </div>
//             <div className="mb-2 text-sm text-gray-600">
//                 {typingUser && $`{typingUser} is typing...`}
//             </div>

// start madness

import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function ChatRoom({ room, messages = [], user, socket }) {
    const [chat, setChat] = useState("");
    const [typingUser, setTypingUser] = useState('');
    const msgRef = useRef(null);
    
    useEffect(() => {
        // Scroll to bottom whenever messages change
        if (msgRef.current) {
            msgRef.current.scrollTop = msgRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        socket.on("typing", (username) => {
            setTypingUser(username);
        });

        socket.on("stopTyping", () => {
            setTypingUser("");
        });

        return () => {
            socket.off("typing");
            socket.off("stopTyping");
        };
    }, [socket]);

    const handleTyping = () => {
        socket.emit("typing");
        setTimeout(() => socket.emit("stopTyping"), 1000);
    };

    const handleSend = () => {
        if (chat.trim()) {
            socket.emit("sendMessage", chat);
            setChat("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
        handleTyping();
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{room.name}</h2>
                <div className="text-xs bg-blue-700 px-2 py-1 rounded-full">
                    {messages.length} messages
                </div>
            </div>
            
            <div 
                className="flex-1 p-4 overflow-y-auto" 
                ref={msgRef}
                style={{ maxHeight: "calc(100vh - 200px)" }}
            >
                {messages.map((msg) => {
                    const isCurrentUser = msg.sender.username === user.username;
                    return (
                        <div 
                            key={msg._id}
                            className={`mb-4 max-w-[80%] ${isCurrentUser ? 'ml-auto' : 'mr-auto'}`}
                        >
                            <div 
                                className={`p-3 rounded-lg shadow-sm ${
                                    isCurrentUser 
                                        ? 'bg-blue-500 text-white rounded-br-none' 
                                        : 'bg-white text-gray-800 rounded-bl-none'
                                }`}
                            >
                                {!isCurrentUser && (
                                    <div className="font-bold text-sm mb-1">{msg.sender.username}</div>
                                )}
                                <div>{msg.content}</div>
                                {msg.createdAt && (
                                    <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {typingUser && (
                <div className="px-4 py-2 text-sm text-gray-600 animate-pulse">
                    <div className="flex items-center">
                        <div className="mr-2">{typingUser} is typing</div>
                        <span className="flex space-x-1">
                            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></span>
                        </span>
                    </div>
                </div>
            )}
            
            <div className="p-4 bg-white border-t">
                <div className="flex gap-2">
                    <textarea
                        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        value={chat}
                        onChange={(e) => setChat(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        rows="2"
                    />
                    <button 
                        className={`px-6 rounded-lg font-medium transition-colors ${
                            chat.trim() 
                                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={handleSend}
                        disabled={!chat.trim()}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
         
  // end madness
//          <div className="flex gap-2">
//             <input
//             className="flex-1 p-2 border rounded"
//             value={chat}
//             onChange={(e) => setChat(e.target.value)} 
            
//             onKeyDown={handleTyping}
//             placeholder="Type a message..."/>

//             <button className="bg-blue-500 text-white px-4 rounded "  onClick={handleSend}>
//            Send
//             </button>
//          </div>
//         </div>
//     );
// }