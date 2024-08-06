import { useState } from "react";
import { Link } from "react-router-dom";
import "./Style.css";

function App() {
  const [building, setBuilding] = useState("");
  const [util, setUtil] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [requestType, setRequestType] = useState("");

  const makeRequest = async (userID) => {
    if (!building || !util || !description || !requestType) {
      alert("Please fill out every field of the form.");
      return;
    }

    const today = new Date().toISOString();
    try {
      const formData = new FormData();
      formData.append("requestDate", today);
      formData.append("requestDescription", description);
      formData.append("requestType", requestType);
      formData.append("amenityType", util);
      formData.append("buildingName", building);
      formData.append("userID", userID);
      if (file) formData.append("imageURL", file);

      const response = await fetch("/insert-request", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert("Request submitted successfully!");
      } else {
        alert("Failed to submit request: " + data.message);
      }
    } catch (error) {
      alert("Internal server error: " + error);
    }
  };

  return (
      <div>
        <div className="Navbar">
          <Link to="/">Home</Link>
        </div>
        <div className="App">
          <header className="App-header">
            <p>Make Request</p>
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
            <select value={requestType} onChange={(e) => setRequestType(e.target.value)}>
              <option value="Update">Update</option>
              <option value="Removal">Removal</option>
              <option value="Add New">Add New</option>
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
                      setFile(e.target.files[0]); // Get the file object
                    }}
                />
                {file && <img src={URL.createObjectURL(file)} alt="Selected file" />} {/* Show file preview */}
              </div>
              <div className="Login-submit">
                <button onClick={() => makeRequest(0 /*TEST USERID*/)}>Submit Request</button>
              </div>
            </div>
          </header>
        </div>
      </div>
  );
}

export default App;
