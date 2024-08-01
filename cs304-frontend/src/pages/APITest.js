import { useState } from "react";
import { Link } from "react-router-dom";
import PopUp from "./PopUp";

const testUtil = {
  utilID: 1777077,
  building: "ICCCS",
  location: "Top floor beside room 350",
  overallRating: 4.8,
  recommended: true,
  cleanliness: 5.0,
  accessible: 3.9,
  functional: 4.8,
  reviews: [
    {
      rating: 4.8,
      description: "it was alright",
    },
    {
      rating: 3.4,
      description: "found a rat in the bowl",
    },
    {
      rating: 5.0,
      description: "someone gave me $500 cash when i entered",
    },
  ],
};

function TestPopUp() {
  return (
    <div>
      <p>Testing the PopUp functionality with a test util</p>
      <PopUp util={testUtil} />
    </div>
  );
}

function App() {
  const [request, setRequest] = useState("");
  const [info, setInfo] = useState();
  var data = null;
  const search = async () => {
    try {
      data = await (
        await fetch(`https://pokeapi.co/api/v2/pokemon/${request}`)
      ).json();
      // console.log(data);
      setInfo(data);
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div>
      <Link to="/"> Home </Link>
      <TestPopUp />
      <p>Testing making API calls https://pokeapi.co/</p>
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
