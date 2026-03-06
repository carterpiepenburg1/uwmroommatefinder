import { useState } from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useChat } from "../context/ChatContext";

/**
 * Text input bar for sending a new message.
 * Writes to conversations/{convoId}/messages and updates lastMessage on the parent.
 */
function MessageInput({ conversation }) {
    const { firebaseUid, conversations } = useChat();
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);

    // Resolve sender display name from the conversation's participantNames map
    const senderName =
        conversation?.participantNames?.[firebaseUid] ?? "Me";

    const handleSend = async (e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed || !conversation || sending) return;

        setSending(true);
        setText("");

        try {
            const msgRef = collection(db, "conversations", conversation.id, "messages");
            await addDoc(msgRef, {
                text: trimmed,
                senderId: firebaseUid,
                senderName: senderName,
                timestamp: serverTimestamp(),
            });

            // Update the lastMessage field on the conversation document
            const convoDocRef = doc(db, "conversations", conversation.id);
            await updateDoc(convoDocRef, {
                lastMessage: {
                    text: trimmed,
                    senderId: firebaseUid,
                    timestamp: serverTimestamp(),
                },
            });
        } catch (err) {
            console.error("[MessageInput] Send failed:", err);
            // Restore message text on error so user doesn't lose their draft
            setText(trimmed);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        // Shift+Enter adds a newline; plain Enter sends
        if (e.key === "Enter" && !e.shiftKey) {
            handleSend(e);
        }
    };

    return (
        <form className="message-input-form" onSubmit={handleSend}>
            <textarea
                className="message-input-textarea"
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message… (Enter to send)"
                disabled={sending}
            />
            <button
                type="submit"
                className="message-send-btn"
                disabled={!text.trim() || sending}
                aria-label="Send message"
            >
                {sending ? "…" : "➤"}
            </button>
        </form>
    );
}

export default MessageInput;
