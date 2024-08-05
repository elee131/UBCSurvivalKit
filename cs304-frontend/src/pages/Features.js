import { useState } from "react";
import { Link } from "react-router-dom";

// TODO: Aggregation Group By: find average rating of utilities in buildings
// TODO: Aggregation Having: display utilities with x amount of reviews
// TODO: Nested Aggregation with Group By: Find building with highest rating of utils
// TODO: Division: Cafes with all drinks a user wants
function App() {
  const [minRatings, setMinRatings] = useState(0);
  const drinks = [
    "capuccino",
    "latte",
    "dark roast",
    "london fog",
    "water",
    "liquid",
    "creatine",
  ];
  const [showDrinks, setShowDrinks] = useState(true);
  const [wantedDrinks, setWantedDrinks] = useState("");
  return (
    <div>
      <div className="Navbar">
        <Link to="/"> Home </Link>
      </div>
      <div>
        <h5>Find average rating of building utils</h5>
        <button
          onClick={() => {
            alert("send api call to get rating of buildings");
          }}
        >
          Find Average Rating of Buildings
        </button>
        <p>
          Here's where the list of buildings would go with their ratings if it
          existed
        </p>
      </div>
      <div>
        <h5>Find utils with minimum amount of ratings</h5>
        <label>
          Minimum Amount of Ratings:
          <input
            type="number"
            value={minRatings}
            onChange={(e) => {
              setMinRatings(e.target.value);
            }}
          />
          <button
            onClick={() => {
              alert(`Sending api call with minRatings=${minRatings}`);
            }}
          >
            Send Request
          </button>
        </label>
        <p>
          Imagine here's the list of utils with at least {minRatings} ratings
        </p>
      </div>
      <div>
        <h5>Find building with highest average util rating</h5>
        <button
          onClick={() => {
            alert(
              "sending api call to find the building with highest average util rating"
            );
          }}
        >
          {" "}
          Find Building with highest average util ratings
        </button>
        <p>Here they would be</p>
      </div>
      <div>
        <h5>Find cafes with these drinks:</h5>
        <button
          onClick={() => {
            setShowDrinks(!showDrinks);
          }}
        >
          Show Available Drinks
        </button>
        <div hidden={!showDrinks}>
          Available Drinks:
          {drinks.map((drink) => (
            <p>{drink}</p>
          ))}
        </div>
        <div>Which Drinks do you want?</div>
        <input
          type="text"
          placeholder="Drinks"
          onChange={(e) => {
            setWantedDrinks(e.target.value);
          }}
        />
        <button
          onClick={() => {
            alert(`Submitting api call with drinks: ${wantedDrinks}`);
          }}
        >
          Submit
        </button>
        <p>Results go here</p>
      </div>
    </div>
  );
}

export default App;
