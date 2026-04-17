import { useState, useEffect } from "react";
import "../styles/Checklist.css";

function Checklist() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
  document.title = "Checklist | Roommate Finder";

  const fetchChecklist = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/checklist/", {
        credentials: "include",
      });

      const data = await res.json();
      setItems(data.checklist || []);
    } catch (err) {
      console.error("Error loading checklist:", err);
    }
  };

  fetchChecklist();
}, []);

  //Adding items
  const addItem = () => {
    if (input.trim() === "") return;

    const newItem = {
      id: Date.now(),
      text: input,
      checked: false,
    };

    setItems([...items, newItem]);
    setInput("");
  };

  //Deleting items
  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  //Checkbox
  const toggleItem = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  //Saving checklist
  const saveChecklist = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/checklist/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(items),
    });

    if (res.ok) {
      alert("Checklist saved!");
    } else {
      alert("Failed to save checklist");
    }
  } catch (err) {
    console.error("Error saving checklist:", err);
  }
};

  return (
    <div className="checklist-page">
      <p className="checklist-subtitle">
        Track needed items for your move.
      </p>

      {/* Text input */}
      <div className="checklist-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addItem();
            }
          }}
          placeholder="Add an item..."
        />
        <button onClick={addItem} className="btn-primary">Add</button>
      </div>

      {/* Show list */}
      <ul className="checklist-list">
        {items.map((item) => (
          <li key={item.id} className="checklist-item">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(item.id)}
            />

            <span className={item.checked ? "checked" : ""}>
              {item.text}
            </span>

            <button onClick={() => deleteItem(item.id)} className="btn-secondary">Delete</button>
          </li>
        ))}
      </ul>

      {/* Save button*/}
      <button onClick={saveChecklist} className="btn-primary save-btn">
        Save
      </button>
    </div>
  );
}

export default Checklist;