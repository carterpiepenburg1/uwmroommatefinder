import { useEffect } from "react";

function Chat() {
  useEffect(() => {
    document.title = "Chat | Roommate Finder";
  }, []);

  return (
    <div>
      <h1>Your Messages</h1>

    <p>Yo</p>
    </div>
  );
}

export default Chat;
