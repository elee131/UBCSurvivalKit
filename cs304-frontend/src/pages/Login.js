import { useState } from "react";
import { Link } from "react-router-dom";
import "./Style.css";
import { setCookie } from "./CookieHelper";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const response = await fetch("/log-in", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result);
      if (result.success) {
        // transform data
        setCookie("userID", result.data.userID);
        alert("Success!");
      } else {
        console.error("Error from server: ", result.message);
      }
    } catch (error) {
      console.error("Error fetching utilities:", error);
      alert("error: " + error);
    }
  };

  return (
    <div>
      <div className="Navbar">
        <Link to="/"> Home </Link>
      </div>
      <div className="App">
        <header className="App-header">
          <p> Welcome Back! </p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username or Email it's undecided :/"
          />
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <div>
            <div className="Login-submit">
              <button
                onClick={() =>
                  alert("username: " + username + "\npassword: " + password)
                }
              >
                Login
              </button>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}

export default App;
