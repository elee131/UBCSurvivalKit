import { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function MakeReview({ utilityID, userID }) {
  const [cleanliness, setCleanliness] = useState(0);
  const [functionality, setFunctionality] = useState(0);
  const [accessibility, setAccessibility] = useState(0);
  const [description, setDescription] = useState("");

  const makeReview = async (utilityID, userID) => {
    if (!cleanliness || !functionality || !accessibility) {
      alert("Please rate all features from 1 to 5.");
      return;
    }

    try {
      const response = await fetch("/insert-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          utilityID: utilityID,
          userID: userID,
          cleanliness: cleanliness,
          functionality: functionality,
          accessibility: accessibility,
          description: description,
        }),
      });

      const data = await response.json();
      console.log()

      if (data.success) {
        alert("Review inserted successfully!");
      } else {
        alert("Failed to insert review: " + data.message);
      }
    } catch (error) {
      alert("Internal server error: " + error);
    }
  };

  return (
      <Popup trigger={<button>Create Review</button>} modal nested>
        {(close) => (
            <div className="modal">
              <button onClick={() => close()}>Close</button>
              <p>Making a new rating for util {utilityID}</p>
              <h5>Select cleanliness from 1 to 5</h5>
              <select onChange={(e) => setCleanliness(e.target.value)}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
              <h5>Select functionality from 1 to 5</h5>
              <select onChange={(e) => setFunctionality(e.target.value)}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
              <h5>Select accessibility from 1 to 5</h5>
              <select onChange={(e) => setAccessibility(e.target.value)}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
              <h5>Please write down your review:</h5>
              <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  rows={4}
                  cols={40}
              />
              <button
                  onClick={() => {
                    makeReview(utilityID, userID);
                  }}
              >
                Post Review
              </button>
            </div>
        )}
      </Popup>
  );
}

function PopUp({ util }) {
  const [detailedInfo, setDetailedInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetailedInfo = async (utilityID) => {
    try {
      const response = await fetch(`/detailed-util-info?utilityID=${utilityID}`);
      const reviews = await fetch(`/reviews-for-util?utilityID"=${utilityID}`);
      if (!response.ok || !reviews.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      const reviewData = await reviews.json();
      console.log(reviewData);
      console.log(reviewData.data);

      let detailedData;
      if (utilityID >= 10000000 && utilityID < 20000000) {
        detailedData = {
          locationID: data.data[0][0],
          overallRating: data.data[0][1],
          buildingCode: data.data[0][2],
          utilityID: data.data[0][3],
          imageURL: data.data[0][4],
          gender: data.data[0][5],
          numStalls: data.data[0][6],
          AccessibilityFeature: data.data[0][7],
          OperatingHour: data.data[0][8],
          isRecommended: data.data[0][9],
          floor: data.data[0][10],
          locationDescription: data.data[0][11],
          //reviews: data.data[0][12] || [], // Assuming reviews are at index 12
        };
      } else if (utilityID >= 20000000 && utilityID < 30000000) {
        detailedData = {
          locationID: data.data[0][0],
          overallRating: data.data[0][1],
          buildingCode: data.data[0][2],
          utilityID: data.data[0][3],
          imageURL: data.data[0][4],
          microwaveSize: data.data[0][5],
          OperatingHour: data.data[0][6],
          isRecommended: data.data[0][7],
          floor: data.data[0][8],
          locationDescription: data.data[0][9],
          //reviews: data.data[0][10] || [], // Assuming reviews are at index 10
        };
      } else {
        detailedData = {
          locationID: data.data[0][0],
          overallRating: data.data[0][1],
          buildingCode: data.data[0][2],
          utilityID: data.data[0][3],
          imageURL: data.data[0][4],
          hasColdWater: data.data[0][5],
          hasHotWater: data.data[0][6],
          OperatingHour: data.data[0][7],
          isRecommended: data.data[0][8],
          floor: data.data[0][9],
          locationDescription: data.data[0][10],
          //reviews: data.data[0][11] || [], // Assuming reviews are at index 11
        };
      }
      setDetailedInfo(detailedData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleOpen = () => {
    fetchDetailedInfo(util.utilityID);
  };

  return (
      <div>
        <Popup trigger={<button>View Details</button>} modal nested onOpen={handleOpen}>
          {(close) => (
              <div className="modal">
                <div>
                  <button onClick={() => close()}>Close popup</button>
                </div>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : (
                    <div className="content">
                      <div>
                        Building: {detailedInfo.buildingCode}; {detailedInfo.locationDescription}
                      </div>
                      <div>Overall Rating: {detailedInfo.overallRating}</div>
                      {detailedInfo.isRecommended.toUpperCase() === "TRUE" ? (
                          <p>Recommended</p>
                      ) : (
                          <p>Not Recommended</p>
                      )}
                      {detailedInfo.gender && <p>Gender: {detailedInfo.gender}</p>}
                      {detailedInfo.numStalls && <p>Number of Stalls: {detailedInfo.numStalls}</p>}
                      {detailedInfo.AccessibilityFeature && <p>Accessibility: {detailedInfo.AccessibilityFeature}</p>}
                      {detailedInfo.microwaveSize && <p>Microwave Size: {detailedInfo.microwaveSize}</p>}
                      {detailedInfo.hasColdWater !== undefined && (
                          <p>Has Cold Water: {detailedInfo.hasColdWater.toUpperCase() === "TRUE" ? "Yes" : "No"}</p>
                      )}
                      {detailedInfo.hasHotWater !== undefined && (
                          <p>Has Hot Water: {detailedInfo.hasHotWater.toUpperCase() === "TRUE" ? "Yes" : "No"}</p>
                      )}
                      <p>Operating Hours: {detailedInfo.OperatingHour}</p>
                      <MakeReview utilityID={util.utilityID} userID={0 /*TEST USERID*/} />
                      <h3>Reviews:</h3>
                      {/*{detailedInfo.reviews.length > 0 ? (*/}
                      {/*    detailedInfo.reviews.map((review) => (*/}
                      {/*        <div key={review.id}>*/}
                      {/*          <h5>Rating: {review.rating}</h5>*/}
                      {/*          <p>{review.description}</p>*/}
                      {/*        </div>*/}
                      {/*    ))*/}
                      {/*) : (*/}
                      {/*    <p>No reviews available</p>*/}
                      {/*)}*/}
                    </div>
                )}
              </div>
          )}
        </Popup>
      </div>
  );
}

export default PopUp;
