import { useState } from "react";
import { Link } from "react-router-dom";
import "./Style.css";
import { setCookie, getCookie } from "./CookieHelper";

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
                  alert(
                    "username: " +
                      username +
                      "\nemail: " +
                      email +
                      "\npassword: " +
                      password
                  );
                  setCookie("username", username);
                  setCookie("email", email);
                  setCookie("password", password);
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
