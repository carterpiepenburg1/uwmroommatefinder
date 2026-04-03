import { useState, useEffect } from "react";
import "../styles/Checklist.css";

function Checklist() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    document.title = "Checklist | Roommate Finder";

    //Loads checklist from local (CHANGE TO GET FROM DATABASE)
    const saved = localStorage.getItem("checklist");
    if (saved) {
      setItems(JSON.parse(saved));
    }
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

  //Saving checklist (CHANGE THIS TO DATABASE LATER ALSO PLEASE)
  const saveChecklist = () => {
    localStorage.setItem("checklist", JSON.stringify(items));
    alert("Checklist saved");
  };

  return (
    <div className="checklist-page">
      <h1 className="checklist-title">Checklist</h1>
      <p className="checklist-subtitle">
        Track needed items for your move.
      </p>

      {/* Text input */}
      <div className="checklist-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add an item..."
        />
        <button onClick={addItem}>Add</button>
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

            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Save button*/}
      <button className="save-btn" onClick={saveChecklist}>
        Save
      </button>
    </div>
  );
}

export default Checklist;