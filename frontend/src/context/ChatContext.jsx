import { createContext, useContext, useEffect, useState } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
    const [firebaseUid, setFirebaseUid] = useState(null);   // Django pk as string
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe = null;

        async function initFirebaseAuth() {
            try {
                // If Firebase failed to initialize (bad/missing env vars), skip silently
                if (!auth || !db) {
                    console.warn("[ChatContext] Firebase not initialized — chat disabled. Check frontend/.env VITE_FIREBASE_* values.");
                    setLoading(false);
                    return;
                }

                // 1. Fetch the custom token that Django minted for this session
                const res = await fetch("http://localhost:8000/api/chat/token/", {
                    credentials: "include",
                });
                if (!res.ok) {
                    // User is not logged into Django – skip Firebase init
                    setLoading(false);
                    return;
                }
                const { token } = await res.json();

                // 2. Sign into Firebase silently (no browser popup)
                const cred = await signInWithCustomToken(auth, token);
                const uid = cred.user.uid;   // this equals the Django user pk string
                setFirebaseUid(uid);

                // Expose uid for debugging: open DevTools console → window.__firebaseUid
                window.__firebaseUid = uid;

                // 3. Subscribe to all conversations where this user is a participant
                const convosRef = collection(db, "conversations");
                const q = query(convosRef, where("participants", "array-contains", uid));
                unsubscribe = onSnapshot(q, (snap) => {
                    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                    // Sort by lastMessage timestamp descending (most recent first)
                    docs.sort((a, b) => {
                        const ta = a.lastMessage?.timestamp?.seconds ?? a.createdAt?.seconds ?? 0;
                        const tb = b.lastMessage?.timestamp?.seconds ?? b.createdAt?.seconds ?? 0;
                        return tb - ta;
                    });
                    setConversations(docs);
                    setLoading(false);
                });
            } catch (err) {
                console.error("[ChatContext] Firebase init error:", err);
                setLoading(false);
            }
        }

        initFirebaseAuth();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return (
        <ChatContext.Provider value={{ firebaseUid, conversations, loading }}>
            {children}
        </ChatContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
    return useContext(ChatContext);
}
