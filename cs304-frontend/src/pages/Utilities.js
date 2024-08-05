import { Link } from "react-router-dom";
import { useState } from "react";
import "./Style.css";
import "./Utilities.css"
import PopUp from "./PopUp";

const testUtil = {
  utilID: 1777077,
  building: "ICCCS",
  location: "Top floor beside room 350",
  overallRating: 4.8,
  recommended: true,
  cleanliness: 5.0,
  accessible: 3.9,
  functional: 4.8,
  reviews: [
    {
      rating: 4.8,
      description: "it was alright",
    },
    {
      rating: 3.4,
      description: "found a rat in the bowl",
    },
    {
      rating: 5.0,
      description: "someone gave me $500 cash when i entered",
    },
  ],
};

const testUtils = [
  {
    utilID: 1,
    type: "washroom",
    rating: 3.2,
    building: "iccs",
    location: "top floor",
  },
  {
    utilID: 2,
    type: "washroom",
    rating: 5.0,
    building: "cbe",
    location: "beside the water fountain",
  },
  {
    utilID: 3,
    type: "microwave",
    rating: 1.7,
    building: "iccs",
    location: "inside a large closet",
  },
  {
    utilID: 4,
    type: "waterfountain",
    rating: 4.1,
    building: "fsc",
    location: "at the end of a rainbow",
  },
  {
    utilID: 5,
    type: "microwave",
    rating: 2.8,
    building: "heb",
    location: "inside the space that cannot be seen",
  },
];

function Util(prop) {
  const util = prop.util;
  return (
    <div className = "utilities">
      <p>Type: {util.type}</p>
      <p>Rating: {util.rating}</p>
      <p>
        Located: {util.building} {util.location}
      </p>
      <label>
        The popup is just a placeholder
        <PopUp util={testUtil} />
      </label>
    </div>
  );
}

function App() {
  const [showWash, setShowWash] = useState(false);
  const [showWater, setShowWater] = useState(false);
  const [showMicro, setShowMicro] = useState(false);
  const [buildingCode, setBuildingCode] = useState("");
  return (
    <div className = "container">
      <div className="Navbar">
        <Link to="/" style={{ textDecoration: 'none',  color: "black"}}>Home</Link>
      </div>

      <div className= "checkbox-container">

      <div className = "utility">
      <label>
        Washrooms
        <input
          type="checkbox"
          checked={showWash}
          onChange={() => {
            setShowWash(!showWash);
          }}
        />
      </label>
      <label>
        Water Fountains
        <input
          type="checkbox"
          checked={showWater}
          onChange={() => {
            setShowWater(!showWater);
          }}
        />
      </label>
      <label>
        Microwaves
        <input
          type="checkbox"
          checked={showMicro}
          onChange={() => {
            setShowMicro(!showMicro);
          }}
        />

      </label>

      </div>

      <label className = "building">
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

      <div className = "utilities-container">
      {testUtils.map((util) => {
        if (
          buildingCode !== "" &&
          buildingCode.toLowerCase() !== util.building
        ) {
          return null;
        }
        if (util.type === "washroom" && showWash) {
          return <Util util={util} />;
        }
        if (util.type === "waterfountain" && showWater) {
          return <Util util={util} />;
        }
        if (util.type === "microwave" && showMicro) {
          return <Util util={util} />;
        }
        return null;
      })}
      </div>
    </div>
  );
}

export default App;
