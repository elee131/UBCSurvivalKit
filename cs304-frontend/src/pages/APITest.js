import { useState } from "react";
import { Link } from "react-router-dom";

function App() {
  const [request, setRequest] = useState("");
  const [info, setInfo] = useState();
  var data = null;
  const search = async () => {
    try {
      data = await (
        await fetch(`https://pokeapi.co/api/v2/pokemon/${request}`)
      ).json();
      console.log(data);
      setInfo(data);
    } catch (e) {
      console.log(e.message);
    }
  };
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
      <button type="submit" onClick={search}>
        Search
      </button>
      <p>{JSON.stringify(info)}</p>
    </div>
  );
}

export default App;
