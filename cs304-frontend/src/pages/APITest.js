import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Fetch(name) {
  const [info, setInfo] = useState();
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        // setInfo(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  // return (
  //   <div>
  //     <p>{info}</p>
  //   </div>
  // );
}

function App() {
  const [request, setRequest] = useState("");
  return (
    <div>
      <Link to="/"> Home </Link>
      <p>
        This is a testing page to see how making API calls work so I'm gonna use
        https://pokeapi.co/
      </p>
      <input
        type="text"
        onChange={(e) => setRequest(e.target.value)}
        placeholder="Insert Name of Pokemon"
      />
      <button onClick={() => Fetch(request)}> Find </button>
    </div>
  );
}

export default App;
