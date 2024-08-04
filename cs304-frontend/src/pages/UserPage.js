import { useState } from "react";
import { Link } from "react-router-dom";

const testReviews = [
  {
    utilID: 1,
    reviewID: 1,
    rating: 5,
    description: "Great",
  },
  {
    utilID: 1,
    reviewID: 2,
    rating: 5,
    description: "Changed my life :D",
  },
  {
    utilID: 2,
    reviewID: 8,
    rating: 2,
    description: "Ate my phone :(",
  },
  {
    utilID: 3,
    reviewID: 4,
    rating: 4,
    description: "Craig was there.",
  },
  {
    utilID: 4,
    reviewID: 9,
    rating: 1,
    description: "Made me look for its 8 pages",
  },
];

function App() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      <div className="Navbar">
        <Link to="/">Home</Link>
      </div>
      <p>
        Until I figure out how to determine which user is currently viewing the
        page this won't be able to do much for now, probably gonna use cookies
        tho
      </p>
      <div>
        <label>
          Change email:
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button
            onClick={() => {
              alert(`setting email to ${email}`);
            }}
          >
            Submit
          </button>
        </label>
      </div>
      <div>
        <label>
          Change username:
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <button
            onClick={() => {
              alert(`setting username to ${username}`);
            }}
          >
            Submit
          </button>
        </label>
      </div>
      <div>
        <label>
          Change password:
          <input
            type="text"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            onClick={() => {
              alert(`setting password to ${password}`);
            }}
          >
            Submit
          </button>
        </label>
      </div>
      {testReviews.map((review) => (
        <div>
          <p> Review for util: {review.utilID} </p>
          <p> Rating: {review.rating} </p>
          <p> Description: {review.description} </p>
          <button
            onClick={() => {
              alert(
                `deleting review with util id: ${review.utilID}; and review id: ${review.reviewID}`
              );
            }}
          >
            {" "}
            Delete Review{" "}
          </button>
          <p> -------- </p>
        </div>
      ))}
    </div>
  );
}

export default App;
