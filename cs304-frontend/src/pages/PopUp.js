import { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function MakeReview(props) {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  return (
    <Popup trigger={<button> Create Review </button>} modal nested>
      {(close) => (
        <div className="modal">
          <button onClick={() => close()}> Close </button>
          <p>Making a new rating for util {props.util.utilID}</p>
          <h5> Select rating from 1 to 5 </h5>
          <select onChange={(e) => setRating(e.target.value)}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <h5> Please write down your review: </h5>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={4}
            cols={40}
          />
          <button
            onClick={() => {
              alert(`Review: ${rating}\n Description: ${description}`);
            }}
          >
            {" "}
            Post Review{" "}
          </button>
        </div>
      )}
    </Popup>
  );
}

function PopUp(props) {
  const util = props.util;
  return (
    <div>
      <Popup trigger={<button> View Details </button>} modal nested>
        {(close) => (
          <div className="modal">
            <div>
              <button onClick={() => close()}> Close popup </button>
            </div>
            <div className="content">
              Building: {util.building}; {util.location}
            </div>
            <div>Overall Rating: {util.overallRating}</div>
            {util.recommended ? <p>Recommended</p> : <p>Not Recommended</p>}
            <p> cleanliness: {util.cleanliness} </p>
            <p> accessible: {util.accessible} </p>
            <p> functional: {util.functional} </p>
            <MakeReview util={util} />
            <h3> Reviews: </h3>
            {util.reviews.map((review) => (
              <div>
                <h5> Rating: {review.rating} </h5>
                <p> {review.description} </p>
              </div>
            ))}
          </div>
        )}
      </Popup>
    </div>
  );
}

export default PopUp;
