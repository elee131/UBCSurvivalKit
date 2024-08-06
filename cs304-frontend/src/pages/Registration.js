import { useState } from "react";
import { Link } from "react-router-dom";
import "./Style.css";
import { setCookie } from "./CookieHelper";

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const addUser = async () => {
    try {
      const response = await fetch("/new-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          isAdmin: "false",
        }),
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result);
      if (result.success) {
        // transform data
        alert("Success!\nNow go to the log-in page to be log in.");
      } else {
        console.error("Error from server: ", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
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
          <p> Register New Account </p>
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="text"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <div>
            <div className="Login-submit">
              <button
                onClick={() => {
                  addUser();
                  // setCookie("username", username);
                  // setCookie("email", email);
                  // setCookie("password", password);
                }}
              >
                Register
              </button>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}

export default App;
