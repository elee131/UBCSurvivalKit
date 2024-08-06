import { useState } from "react";
import { Link } from "react-router-dom";

// TODO: Aggregation Group By: find average rating of utilities in buildings
// TODO: Aggregation Having: display utilities with x amount of reviews
// TODO: Nested Aggregation with Group By: Find building with highest rating of utils
// TODO: Division: Cafes with all drinks a user wants

const determineType = (id) => {
  if (id >= 10000000 && id < 20000000) return "Washroom";
  if (id >= 20000000 && id < 30000000) return "Microwave";
  if (id >= 30000000 && id < 40000000) return "Water Fountain";
  return "Unknown";
};

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


  const [averageRatings, setAverageRatings] = useState([]);
  const [minimumReviewUtil, setMinimumReviewUtil] = useState([]);
  const [showDrinks, setShowDrinks] = useState(true);
  const [wantedDrinks, setWantedDrinks] = useState("");

  const fetchAverageRatings = async () => {
    try {
      const response = await fetch(`/average-rating`);
      const result = await response.json();
      const data = result.data;
      setAverageRatings(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchMinReviewUtil = async () => {
    try {
      const response = await fetch(`/util-with-numReviews?minReviewNum=${minRatings}`);
      const result = await response.json();

      if (result.success) {
        const data = result.data;
        setMinimumReviewUtil(data);
        console.log(data);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <div className="Navbar">
        <Link to="/"> Home </Link>
      </div>
      <div>
        <h5>Find average rating of building utils</h5>
        <button onClick={fetchAverageRatings}>
          Find Average Rating of Buildings
        </button>

        <div>
          {averageRatings.map(([buildingName, rating], index) => (
            <div key={index} className="rating-item">
              <p>
                <strong>Building:</strong> {buildingName}
              </p>
              <p>
                <strong>Rating:</strong> {rating.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h5>Find utils with minimum amount of ratings</h5>
        <label>
          Show Amenities with At Least X Reviews
          <input
            type="number"
            value={minRatings}
            onChange={(e) => {
              setMinRatings(e.target.value);
            }}
          />
          <button onClick={fetchMinReviewUtil}>Send Request</button>
        </label>

       <div>
                 {minimumReviewUtil.map(([utilityID, rating]) => (
                   <div key={utilityID} className="util-item">
                     <p><strong>Type:</strong> {determineType(utilityID)}</p>
                     <p><strong>Rating:</strong> {rating}</p>
                     <p><strong>Utility ID:</strong> {utilityID}</p>
                   </div>
                 ))}
               </div>
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
          {drinks.map((drink, index) => (
            <p key={index}>{drink}</p>
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
