import { useState, useEffect} from "react";
import { Link } from "react-router-dom";

function App() {
  const [userID, setUserID] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);



  useEffect(() => {
      const fetchReviews = async () => {
        if (userID === undefined) return;

        try {
          const response = await fetch(`/reviews-for-user?userID=${userID}`);

          if (!response.ok) {
            throw new Error('Error found while retrieving the response');
          }

          const result = await response.json();
          const data = result.data.map(([utilID, reviewID, , rating, , , description]) => ({
            utilID,
            reviewID,
            rating,
            description,
          }));

          setReviews(data);
          console.log(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchReviews();
    }, [userID]);




  const handleEmailChange = async () => {
    if (!email) {
      alert("Email cannot be empty");
      return;
    }

    try {
      const response = await fetch("/update-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID, newEmail: email }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Email updated successfully");
      } else {
        alert("Failed to update email: " + data.message);
      }
    } catch (error) {
      alert("Internal server error");
    }

    setEmail("");
  };

  const handleUsernameChange = async () => {
    if (!username) {
      alert("Username cannot be empty");
      return;
    }

    try {
      const response = await fetch("/update-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID, newName: username }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Username updated successfully");
      } else {
        alert("Failed to update username: " + data.message);
      }
    } catch (error) {
      alert("Internal server error");
    }

    setUsername("");
  };

  const handlePasswordChange = async () => {
    if (!password) {
      alert("Password cannot be empty");
      return;
    }

    try {
      const response = await fetch("/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID, newPassword: password }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Password updated successfully");
      } else {
        alert("Failed to update password: " + data.message);
      }
    } catch (error) {
      alert("Internal server error");
    }

    setPassword("");
  };

  return (
    <div>
      <div className="Navbar">
        <Link to="/">Home</Link>
      </div>
      <div>
        <label>
          Change email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleEmailChange}>Submit</button>
        </label>
      </div>
      <div>
        <label>
          Change username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleUsernameChange}>Submit</button>
        </label>
      </div>
      <div>
        <label>
          Change password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handlePasswordChange}>Submit</button>
        </label>
      </div>
      {reviews.map((review) => (
        <div key={review.reviewID}>
          <p>Review for util: {review.utilID}</p>
          <p>Rating: {review.rating}</p>
          <p>Description: {review.description}</p>
          <button
            onClick={() => {
              alert(
                `Deleting review with util ID: ${review.utilID}; and review ID: ${review.reviewID}`
              );
            }}
          >
            Delete Review
          </button>
          <p>--------</p>
        </div>
      ))}
    </div>
  );
}

export default App;
