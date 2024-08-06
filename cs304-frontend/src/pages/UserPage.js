import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCookie, setCookie} from './CookieHelper';

function UserPage() {
  const [userID, setUserID] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reviews, setReviews] = useState([]);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const makeCookie = setCookie("userID", 0, 10); // just for testing imma delte later

    const cookieUserID = getCookie("userID");
    console.log(cookieUserID)
    if (!cookieUserID) {
       console.log("I am here!");
      navigate("/login");
      return;
    }
    setUserID(cookieUserID);
  }, [navigate]);

  useEffect(() => {
    if (userID) {
      fetchReviews();
      fetchRequests();
    }
  }, [userID]);

  const fetchReviews = async () => {
    if (!userID) {
      setReviews([]);
      return;
    }

    try {
      const response = await fetch(`/reviews-for-user?userID=${userID}`);
      if (!response.ok) {
        throw new Error('Error found while retrieving the response');
      }
      const result = await response.json();
      const data = result.data.map(([reviewID, utilityID, userID, cleanliness, functionality, accessibility, description]) => ({
        reviewID,
        utilityID,
        userID,
        cleanliness,
        functionality,
        accessibility,
        description,
      }));
      setReviews(data);
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchRequests = async () => {
    if (!userID) {
      setRequests([]);
      return;
    }

    try {
      const response = await fetch(`/requests-for-user?userID=${userID}`);
      if (!response.ok) {
        throw new Error('Error found while retrieving the response');
      }
      const result = await response.json();
      const data = result.data.map(([requestID, requestDate, status, requestDescription, requestType, amenityType, buildingName, userID, imageURL]) => ({
        requestID,
        buildingName,
        amenityType,
        requestType,
        status,
        requestDescription,
      }));
      setRequests(data);
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

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

  const deleteReviews = async (reviewID, utilityID) => {
    try {
      console.log(reviewID, utilityID);
      const response = await fetch(`/delete-review/${reviewID}/${utilityID}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        await fetchReviews();
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    }
  };

  const deleteRequests = async (requestID) => {
    try {
      console.log(requestID);
      const response = await fetch(`/delete-request/${requestID}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        await fetchRequests();
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Error deleting request');
    }
  };

  const deleteAccount = async (userID) => {
    try {
      const response = await fetch(`/delete-account/${userID}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setCookie("userID", null);
        setUserID(null);
        navigate("/login");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account');
    }
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
          <p>Review for util: {review.utilityID}</p>
          <p>Cleanliness: {review.cleanliness}</p>
          <p>Functionality: {review.functionality}</p>
          <p>Accessibility: {review.accessibility}</p>
          <p>Description: {review.description}</p>
          <button
            onClick={() => deleteReviews(review.reviewID, review.utilityID)}
          >
            Delete Review
          </button>
          <p>--------</p>
        </div>
      ))}

      {requests.map((request) => (
        <div key={request.requestID}>
          <p>Request</p>
          <p>Request Type: {request.requestType}</p>
          <p>Amenity Type: {request.amenityType}</p>
          <p>Status: {request.status}</p>
          <p>Description: {request.requestDescription}</p>
          <button
            onClick={() => deleteRequests(request.requestID)}
          >
            Delete Request
          </button>
          <p>--------</p>
        </div>
      ))}

      <button onClick={() => deleteAccount(userID)}>Delete Account</button>
    </div>
  );
}

export default UserPage;
