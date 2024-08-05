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
  const [userID, setUserID] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");



  const handleEmailChange = async () => {
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
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
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
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
           <button onClick={handleUsernameChange}>Submit</button>
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
           <button onClick={handlePasswordChange}>Submit</button>
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
