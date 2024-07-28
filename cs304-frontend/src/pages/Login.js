import { useState } from "react";
import { Link } from "react-router-dom";
import "./Style.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="text"
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
