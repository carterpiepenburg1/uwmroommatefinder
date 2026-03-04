import { useEffect, useState } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import "../styles/Chat.css";

function Chat() {
  const [selectedConvo, setSelectedConvo] = useState(null);

  useEffect(() => {
    document.title = "Chat | Roommate Finder";
  }, []);

  return (
    <div className="chat-page">
      {/* Left panel – conversation list */}
      <aside className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2 className="chat-sidebar-title">Messages</h2>
        </div>
        <ChatList
          selectedId={selectedConvo?.id}
          onSelect={setSelectedConvo}
        />
      </aside>

      {/* Right panel – active conversation */}
      <main className="chat-main">
        <ChatWindow conversation={selectedConvo} />
      </main>
    </div>
  );
}

export default Chat;
