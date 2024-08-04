import { Link } from "react-router-dom";
import "./Style.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Link to="/login"> Login </Link>
        <Link to="/registration"> Registration </Link>
        <Link to="/request"> Request </Link>
        <Link to="/utilities"> Utilities </Link>
        <Link to="/cafes"> Cafes </Link>
        <Link to="/user"> User Page</Link>
        <Link to="/admin"> Admin Page </Link>
        <Link to="/features"> Features </Link>
        <Link to="/testing"> Test </Link>
      </header>
    </div>
  );
}

export default App;
