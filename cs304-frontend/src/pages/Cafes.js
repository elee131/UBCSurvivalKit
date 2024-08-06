import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Style.css";
import "./Utilities.css";


function Cafe({ cafe }) {
  return (
    <div className="cafe">
      <p>Name: {cafe.name}</p>
      <p>
        Building: {cafe.buildingCode} | Operating Hours: {cafe.operatingHours}
      </p>
    </div>
  );
}

function App() {
  const [buildingCode, setBuildingCode] = useState("");
  const [cafes, setCafes] = useState([]);

  const fetchCafes = async () => {
    try {
      const response = await fetch(`/all-cafes`);
      const result = await response.json();
      const data = result.data.map(
        ([name, operatingHours, buildingCode]) => ({
          name,
          operatingHours,
          buildingCode,
        })
      );
      setCafes(data);
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchCafes();
  }, []);

  return (
    <div className="cafe-container">
      <div className="Navbar">
        <Link to="/" style={{ textDecoration: 'none', color: "black" }}>
          Home
        </Link>
      </div>

      <div className="cafe-building">
        <label>
          Building:
          <input
            type="text"
            value={buildingCode}
            onChange={(e) => {
              setBuildingCode(e.target.value);
            }}
          />
        </label>
      </div>

      <div className="cafes">
        {cafes.map((cafe) => {
          if (buildingCode !== "" && buildingCode.toLowerCase() !== cafe.buildingCode.toLowerCase()) {
            return null;
          }
          return <Cafe key={cafe.cafeID} cafe={cafe} />;
        })}
      </div>
    </div>
  );
}

export default App;
