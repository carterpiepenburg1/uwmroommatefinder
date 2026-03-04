import { useEffect, useRef, useState } from "react";
import { collection, orderBy, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useChat } from "../context/ChatContext";
import MessageInput from "./MessageInput";

/**
 * Shows the real-time message feed for the selected conversation.
 * Subscribes to conversations/{convoId}/messages ordered by timestamp.
 */
function ChatWindow({ conversation }) {
    const { firebaseUid } = useChat();
    const [messages, setMessages] = useState([]);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!conversation) return;

        const msgRef = collection(db, "conversations", conversation.id, "messages");
        const q = query(msgRef, orderBy("timestamp", "asc"));

        const unsub = onSnapshot(q, (snap) => {
            setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });

        return () => unsub();
    }, [conversation?.id]);

    // Auto-scroll to the bottom whenever messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!conversation) {
        return (
            <div className="chat-window-empty">
                <div className="chat-window-empty-icon">💬</div>
                <h3>Select a conversation</h3>
                <p>Choose a chat from the left, or start a new one from the Explore page.</p>
            </div>
        );
    }

    // Resolve display name for the header
    const otherUid = conversation.participants?.find((p) => p !== firebaseUid);
    const headerName =
        conversation.participantNames?.[otherUid] ??
        (conversation.type === "group" ? conversation.name ?? "Group Chat" : "Chat");

    return (
        <div className="chat-window">
            {/* Header */}
            <div className="chat-window-header">
                <div className="chat-avatar chat-avatar-header">
                    {headerName.charAt(0).toUpperCase()}
                </div>
                <span className="chat-window-header-name">{headerName}</span>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="chat-no-messages">
                        No messages yet — say hello! 👋
                    </div>
                )}
                {messages.map((msg) => {
                    const isMine = msg.senderId === firebaseUid;
                    return (
                        <div
                            key={msg.id}
                            className={`chat-bubble-wrapper ${isMine ? "mine" : "theirs"}`}
                        >
                            {!isMine && (
                                <span className="chat-sender-name">{msg.senderName}</span>
                            )}
                            <div className={`chat-bubble ${isMine ? "bubble-mine" : "bubble-theirs"}`}>
                                {msg.text}
                            </div>
                            {msg.timestamp && (
                                <span className="chat-timestamp">
                                    {new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            )}
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <MessageInput conversation={conversation} />
        </div>
    );
}

export default ChatWindow;
