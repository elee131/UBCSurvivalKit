import { Link } from "react-router-dom";
import "./Style.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Link to="/login"> Login </Link>
        <Link to="/registration"> Registration </Link>
        <Link to="/request"> Request </Link>
        <Link to="/testing"> Test </Link>
      </header>
    </div>
  );
}

export default App;
