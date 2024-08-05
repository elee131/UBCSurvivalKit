import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import "./Style.css";
import { useState } from "react";

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

function UtilPopUp(props) {
  const request = props.request;
  const [building, setBuilding] = useState(request.building);
  const [location, setLocation] = useState("");
  const [util, setUtil] = useState(request.util);
  const [desc, setDesc] = useState(request.desc);
  return (
    <div>
      <Popup trigger={<button> Accept Request </button>} modal nested>
        {(close) => (
          <div className="modal">
            <input
              type="text"
              value={request.building}
              placeholder="Building Code"
              onChange={(e) => {
                setBuilding(e.target.value);
              }}
            />
            <input
              type="text"
              value=""
              placeholder="Location"
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            />
            <input
              type="text"
              value={request.util}
              placeholder="type"
              onChange={(e) => {
                setUtil(e.target.value);
              }}
            />
            <textarea
              value={request.desc}
              placeholder="Description"
              onChange={(e) => {
                setDesc(e.target.value);
              }}
              rows={4}
              columns={20}
            />
            <button
              onClick={() => {
                alert(
                  `Building: ${building}; Location: ${location}; type: ${util}; desc: ${desc}`
                );
              }}
            >
              Add
            </button>
          </div>
        )}
      </Popup>
    </div>
  );
}

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
      <UtilPopUp request={request} />
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
