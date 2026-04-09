import { useChat } from "../context/ChatContext";

/**
 * Renders the list of active conversations in the left panel of the Chat page.
 * Calls onSelect(conversation) when the user clicks a conversation.
 */
function ChatList({ selectedId, onSelect }) {
    const { conversations, loading, firebaseUid } = useChat();

    if (loading) {
        return <div className="chat-list-empty">Connecting to chat…</div>;
    }

    if (!firebaseUid) {
        return (
            <div className="chat-list-empty">
                <p>Not signed in to chat.</p>
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="chat-list-empty">
                <p>No conversations yet.</p>
                <p className="chat-list-hint">
                    Go to <strong>Explore &amp; Connect</strong> to message a match.
                </p>
            </div>
        );
    }

    return (
        <ul className="chat-list">
            {conversations.map((convo) => {
                // 1-on-1: show the other person's name. Group (3+): show "Group Chat"
                const isGroup = (convo.participants?.length ?? 0) > 2;
                const otherUid = convo.participants?.find((p) => p !== firebaseUid);
                const displayName = isGroup
                    ? "Group Chat"
                    : convo.participantNames?.[otherUid] ?? "Unknown";

                const lastText = convo.lastMessage?.text ?? "No messages yet";
                const isSelected = convo.id === selectedId;

                return (
                    <li
                        key={convo.id}
                        className={`chat-list-item ${isSelected ? "active" : ""}`}
                        onClick={() => onSelect(convo)}
                    >
                        <div className="chat-avatar">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="chat-list-info">
                            <span className="chat-list-name">{displayName}</span>
                            <span className="chat-list-last">{lastText}</span>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

export default ChatList;
