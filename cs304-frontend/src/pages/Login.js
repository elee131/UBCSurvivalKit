import { useState } from "react";
import { Link } from "react-router-dom";
import "./Style.css";
import { setCookie } from "./CookieHelper";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const response = await fetch("/log-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
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
        setCookie("userID", result.data[0][0]);
        setCookie("isAdmin", result.data[0][2]);
        alert("Success!");

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
          <p> Welcome Back! </p>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <div>
            <div className="Login-submit">
              <button
                onClick={() => {
                  login();
                }}
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
