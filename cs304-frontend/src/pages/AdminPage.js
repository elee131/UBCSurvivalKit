import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import "./Style.css";
import { useEffect, useState } from "react";

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

  const addRequest = async () => {
    if (util === "waterfountain") {
      // insert a waterfountain
      try {
        const response = await fetch("/insert-waterfountain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            buildingCode: building,
            locationID: location,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const result = await response.json();
        console.log(result);
        if (result.success) {
          alert("Success! New waterfountain has been added");
        } else {
          console.error("Error from server: ", result.message);
        }
      } catch (error) {
        console.error("error: ", error);
      }
    } else if (util === "microwave") {
      // insert a microwave
      try {
        const response = await fetch("/insert-microwave", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            buildingCode: building,
            locationID: location,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const result = await response.json();
        console.log(result);
        if (result.success) {
          alert("Success! New microwave has been added");
        } else {
          console.error("Error from server: ", result.message);
        }
      } catch (error) {
        console.error("error: ", error);
      }
    } else if (util === "washroom") {
      // insert a washroom
      try {
        const response = await fetch("/insert-washroom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            buildingCode: building,
            locationID: location,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const result = await response.json();
        console.log(result);
        if (result.success) {
          alert("Success! New washroom has been added");
        } else {
          console.error("Error from server: ", result.message);
        }
      } catch (error) {
        console.error("error: ", error);
      }
    } else {
      alert(
        "Type of amenity is not one of waterfountain, microwave, or washroom"
      );
    }
  };

  return (
    <div>
      <Popup trigger={<button> Accept Request </button>} modal nested>
        {(close) => (
          <div className="modal">
            <input
              type="text"
              value={request.buildingName}
              placeholder="Building Code"
              onChange={(e) => {
                setBuilding(e.target.value);
              }}
            />
            <input
              type="number"
              value={0}
              placeholder="Location ID"
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            />
            <input
              type="text"
              value={request.amenityType}
              placeholder="type"
              onChange={(e) => {
                setUtil(e.target.value);
              }}
            />
            <textarea
              value={request.description}
              placeholder="Description"
              onChange={(e) => {
                setDesc(e.target.value);
              }}
              rows={4}
              columns={20}
            />
            <button
              onClick={() => {
                addRequest();
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
  const rejectRequest = async () => {
    try {
      const response = await fetch(`/delete-request/${request.requestID}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);
      console.log(result.data);

      if (result.success) {
        alert("successfully removed request (may need to reload page)");
      } else {
        console.error("Error from the server: ", result.message);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  return (
    <div className="Request">
      <p>RequestID: {request.requestID}</p>
      <p>Request Date: {request.requestDate}</p>
      <p>status: {request.status}</p>
      <p>description: {request.description}</p>
      <p>request Type: {request.requestType}</p>
      <p>amenity Type: {request.amenityType}</p>
      <p>building name: {request.buildingName}</p>
      <p>userID: {request.userID}</p>
      <p>imageURL: {request.imageURL}</p>
      <UtilPopUp request={request} />
      <button onClick={rejectRequest}> Deny Request </button>
    </div>
  );
}

function App() {
  const [requests, setRequests] = useState([]);
  const fetchRequests = async () => {
    try {
      const response = await fetch("/all-requests", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);
      console.log(result.data);

      if (result.success) {
        const formattedData = result.data.map((item) => ({
          requestID: item[0],
          requestDate: item[1],
          status: item[2],
          description: item[3],
          requestType: item[4],
          amenityType: item[5],
          buildingName: item[6],
          userID: item[7],
          imageURL: item[8],
        }));
        console.log("formattedData: ", formattedData);
        setRequests(formattedData);
      } else {
        console.error("Error from server: ", result.message);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  });

  return (
    <div>
      <div className="Navbar">
        <Link to="/"> Home </Link>
      </div>
      <div className="App">
        <div className="App-header">
          <h3> Listing Requests </h3>
          {requests.map((request) => (
            <Request request={request} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
