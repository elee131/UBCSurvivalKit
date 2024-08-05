import { useState } from "react";
import { Link } from "react-router-dom";
import "./Style.css";
import { getCookie } from "./CookieHelper";

function App() {
  const [username, setUsername] = useState(getCookie("username"));
  const [password, setPassword] = useState(getCookie("password"));
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
