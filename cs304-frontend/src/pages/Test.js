import logo from "../logo.svg";
import "../App.css";

import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/Home.js</code> and save to reload.
        </p>
        <p>This is the test home screen located at "/".</p>
        <Link to="/login"> Login </Link>
        <Link to="/registration"> Registration </Link>
        <Link to="/request"> Request </Link>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
