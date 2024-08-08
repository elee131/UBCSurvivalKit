import { Link } from "react-router-dom";
import { useState } from "react";
import "./Style.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [reviews, setReviews] = useState([]);

  const sendQuery = async () => {
    alert(`Query: ${query}`);
    try {
      const response = await fetch("/select-reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
        }),
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result);
      if (result.success) {
        console.log(`result.data: ${result.data}`);
        // console.log(`result.data[0]: ${result.data[0]}`);
        setReviews(result.data);
      } else {
        console.error(result.message);
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <div>
      <div className="Navbar">
        <Link to="/">Home</Link>
      </div>
      <p>
        Search for a review with specific numbers for "Functionality",
        "Cleanliness" and "Accessibility" using any amount of && and ||.
      </p>
      <p>Comparator values include ==, !=, &gt;, &gt;=, &lt;, &lt;=</p>
      <p>
        Can also search by "ReviewID", "UtilityID", and "UserID" if you know
        what specific review, utility, or user you're looking for.
      </p>
      <input
        placeholder="Insert Query"
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      <button
        onClick={() => {
          // alert();
          sendQuery();
        }}
      >
        {" "}
        Send{" "}
      </button>
      {reviews.map((review) => (
        <div>
          <p>ReviewID: {review[0]}</p>
          <p>UtilityID: {review[1]}</p>
          <p>UserID: {review[2]}</p>
          <p>Cleanliness: {review[3]}</p>
          <p>Functionality: {review[4]}</p>
          <p>Accessibility: {review[5]}</p>
          <p>Description: {review[6]}</p>
          <p>==================================</p>
        </div>
      ))}
    </div>
  );
}
