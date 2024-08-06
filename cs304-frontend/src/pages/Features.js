import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Utilities.css";

const determineType = (id) => {
  if (id >= 10000000 && id < 20000000) return "Washroom";
  if (id >= 20000000 && id < 30000000) return "Microwave";
  if (id >= 30000000 && id < 40000000) return "Water Fountain";
  return "Unknown";
};

function App() {
  const [minRatings, setMinRatings] = useState(0);
  const [averageRatings, setAverageRatings] = useState([]);
  const [minimumReviewUtil, setMinimumReviewUtil] = useState([]);
  const [bestBuildings, setBestBuildings] = useState([]);
  const [cafeWithDrinks, setCafeWithDrinks] = useState([]);
  const [allDrinks, setAllDrinks] = useState([])

//  const [showDrinks, setShowDrinks] = useState(true);

  const [wantedDrinks, setWantedDrinks] = useState("");


  useEffect(() => {
      fetchAllDrinks();
    }, []);




  const fetchAverageRatings = async () => {
    try {
      const response = await fetch(`/average-rating`);
      const result = await response.json();
      setAverageRatings(result.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchMinReviewUtil = async () => {
    try {
      const response = await fetch(`/util-with-numReviews?minReviewNum=${minRatings}`);
      const result = await response.json();
      if (result.success) {
        setMinimumReviewUtil(result.data);
        console.log(result.data);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchBestRatedBuilding = async () => {
    try {
      const response = await fetch(`/best-rated-building`);
      const result = await response.json();
      if (result.success) {
        setBestBuildings(result.data);
        console.log(result.data);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchCafeWithDrinks = async () => {
    try {
      const response = await fetch(`/find-cafes-with-drink?selectedDrinks=${wantedDrinks}`);
      const result = await response.json();
      if (result.success) {
        setCafeWithDrinks(result.data);
        console.log(result.data);
      } else {
        setCafeWithDrinks([]);
        alert(result.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchAllDrinks = async () => {
     try {
          const response = await fetch(`/all-drinks`);
          const result = await response.json();

          if (result.success) {
            setAllDrinks(result.data);
          } else {
            alert(result.message);
          }
        } catch (error) {
          console.log(error.message);
        }
  };




  return (
    <div className = "features-container">
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
              <p><strong>Building:</strong> {buildingName}</p>
              <p><strong>Rating:</strong> {rating.toFixed(2)}</p>
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
            onChange={(e) => setMinRatings(e.target.value)}
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
        <button onClick={fetchBestRatedBuilding}>
          Find Building with the highest average Utility Rating
        </button>
        <div>
          {bestBuildings.map(([buildingCode, rating]) => (
            <div key={buildingCode} className="util-item">
              <p><strong>Building Code:</strong> {buildingCode}</p>
              <p><strong>Rating:</strong> {rating}</p>
            </div>
          ))}
        </div>
      </div>
<div>

<div>
        <div>Available Drinks</div>

        {allDrinks.map(([drinkName]) => (
                  <div key={drinkName}>
                 <p><strong>Drink Name:</strong> {drinkName}</p>
                  </div>
                          ))}

                          </div>




        <div>Which Drinks do you want?</div>
        <input
          type="text"
          placeholder="Drinks"
          onChange={(e) => setWantedDrinks(e.target.value)}
        />
        <button onClick={fetchCafeWithDrinks}>
          Submit
        </button>
        <div>
       {cafeWithDrinks.map(([cafeId, name, hours, buildingCode]) => (
          <div key={cafeId} className="cafe-item">
         <p><strong>Cafe Name:</strong> {name}</p>
         <p><strong>Building Code:</strong> {buildingCode}</p>
         <p><strong>Operating Hours:</strong> {hours}</p>
          </div>
                  ))}
       </div>
      </div>
    </div>
  );
}

export default App;
