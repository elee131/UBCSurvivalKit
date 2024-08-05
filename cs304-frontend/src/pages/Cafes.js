import { Link } from "react-router-dom";
import { useState } from "react";
import "./Style.css";
import "./Utilities.css";
import CafePopUp from "./CafePopUp";

const testCafe = {
  id: 1,
  name: "Starbuck",
  building: "iccs",
  location: "over there",
  drinks: ["latte", "london fog", "dark roast"],
};

const testCafes = [
  {
    id: 1,
    name: "Starbuck",
    building: "iccs",
    location: "over there",
  },
  {
    id: 2,
    name: "Tim Hortons",
    building: "heb",
    location: "where the tim hortons is",
  },
  {
    id: 3,
    name: "Tim Hortons",
    building: "fsc",
    location: "Right behind you",
  },
  {
    id: 4,
    name: "Java",
    building: "iccs",
    location: "no way like the computing language?",
  },
  {
    id: 5,
    name: "Starbuck",
    building: "nest",
    location: "you know i think it's actually starbucks with an s",
  },
  {
    id: 6,
    name: "coffee place",
    building: "eosc",
    location: "mmm cofffeee",
  },
];

function Cafe(prop) {
  const cafe = prop.cafe;
  return (
    <div>
      <p>Name: {cafe.name}</p>
      <p>
        Building: {cafe.building} | Location: {cafe.location}
      </p>
      <label>The popup is just a placeholder</label>
      <CafePopUp cafe={testCafe} />
      <p>------------</p>
    </div>
  );
}

function App() {
  const [buildingCode, setBuildingCode] = useState("");
  return (
    <div className = "cafe-container">
      <div className="Navbar">
         <Link to="/" style={{ textDecoration: 'none',  color: "black"}}>Home</Link>
      </div>

      <div className = "cafe-building">
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

      <div className = "cafes">
      {testCafes.map((cafe) => {
        if (
          buildingCode !== "" &&
          buildingCode.toLowerCase() !== cafe.building
        ) {
          return null;
        }
        return <div className = "cafe"><Cafe cafe={cafe} /> </div>;
      })}

      </div>
    </div>
  );
}

export default App;
