import { Link } from "react-router-dom";
import "./Style.css";

const testList = [
  {
    building: "iccs",
    util: "washroom",
    desc: "it's a washroom",
  },
  {
    building: "fsc",
    util: "water fountain",
    desc: "mmm water",
  },
];

function Request(prop) {
  const request = prop.request;
  function addRequest() {
    alert(
      "Hasn't been implemented yet, suppose I'd need the backend first, also would need a way to generate the details for different utils hmm"
    );
    return null;
  }
  function rejectRequest() {
    alert("Send api call to remove this request");
    return null;
  }
  return (
    <div className="Request">
      <p>Building: {request.building}</p>
      <p> Util type: {request.util} </p>
      <p> Description: {request.desc} </p>
      <button onClick={addRequest}> Accept Request </button>
      <button onClick={rejectRequest}> Deny Request </button>
    </div>
  );
}

function App() {
  return (
    <div>
      <div className="Navbar">
        <Link to="/"> Home </Link>
      </div>
      <div className="App">
        <div className="App-header">
          <h3> Listing Requests </h3>
          {testList.map((request) => (
            <Request request={request} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
