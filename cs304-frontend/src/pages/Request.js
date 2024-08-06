import { useState } from "react";
import { Link } from "react-router-dom";
import "./Style.css";

function App() {
  const [building, setBuilding] = useState("");
  const [util, setUtil] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState();

  return (
    <div>
      <div className="Navbar">
        <Link to="/"> Home </Link>
      </div>
      <div className="App">
        <header className="App-header">
          <p> Make Request </p>
          <input
            type="text"
            onChange={(e) => setBuilding(e.target.value)}
            placeholder="Building Code"
          />
          <select value={util} onChange={(e) => setUtil(e.target.value)}>
            <option value="Washroom">Washroom</option>
            <option value="WaterFountain">Water Fountain</option>
            <option value="Microwave">Microwave</option>
          </select>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={4}
            cols={40}
          />
          <div>
            <div className="Login-submit">
              <input
                type="file"
                onChange={(e) => {
                  setFile(e.target.value);
                }}
              />
              <img src={file} />
            </div>
            <div className="Login-submit">
              <button
                onClick={() =>
                  alert(
                    "Building Code: " +
                      building +
                      "\nUtil Type: " +
                      util +
                      "\nDescription: " +
                      description
                  )
                }
              >
                Submit Request
              </button>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}

export default App;
