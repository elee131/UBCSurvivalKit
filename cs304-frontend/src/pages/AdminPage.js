import { Link, useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import "./Style.css";
import { useEffect, useState } from "react";
import { getCookie, setCookie} from './CookieHelper';

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
  const [floorNumber, setFloorNumber] = useState(0);
  const [util, setUtil] = useState("waterfountain");
  const [locationDesc, setLocationDesc] = useState("");
  const [microwaveSize, setMicrowaveSize] = useState("");
  const [hasColdWater, setHasColdWater] = useState("");
  const [hasHotWater, setHasHotWater] = useState("");
  const [gender, setGender] = useState("");
  const [numStalls, setNumStalls] = useState(1);
  const [accessibilityFeature, setAccessibilityFeature] = useState("");
  const [locationID, setLocationID] = useState(0);
  const addRequest = async () => {

    try {
      const response = await fetch("/insert-location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          floor:floorNumber,
          locationDescription: locationDesc
        }),
      });

      if (!response.ok) {
        throw new Error(
            `Network response was not ok: ${response.statusText}`
        );
      }
      const result = await response.json();
      console.log(result);
      if (!result.success) {
        console.error("Error from server: "+ result.message);
        alert("Failed to insert location:"+ result.message);
        return;
      } else {
        setLocationID(result.data);
      }

    } catch (e) {
      alert("Error while inserting location" + e);
    }


    if (util === "waterfountain") {
      // insert a waterfountain
      try {
        const response = await fetch("/insert-waterfountain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            overallRating: 0.0,
            buildingCode: building,
            locationID:locationID,
            hasColdWater: hasColdWater,
            hasHotWater: hasHotWater
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
          alert("Failed to insert microwave:", result.message);
        }
      } catch (error) {
        console.error("error: ", error);
      }
    } else if (util === "microwave") {

      try {
        const response = await fetch("/insert-microwave", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            overallRating: 0.0,
            buildingCode: building,
            locationID:locationID,
            microwaveSize:microwaveSize
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
          console.error("Error from server: "+ result.message);
          alert("Failed to insert microwave:"+  result.message);
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
            overallRating: 0.0,
            buildingCode:building,
            locationID:locationID,
            gender:gender,
            numStalls:numStalls,
            accessibilityFeatures: accessibilityFeature,
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
          alert("Failed to insert microwave:" +  result.message);
        }
      } catch (error) {
        console.error("error: ", error);
      }
    } else {
      alert(
        "Type of amenity is not one of waterfountain, microwave, or washroom"
      );
      console.log(request.amenityType);
    }
  };

  return (
      <div>
        <Popup trigger={<button> Accept Request </button>} modal nested>
          {(close) => (
              <div className="modal">
                <label>Building Code</label>
                <input
                    type="text"
                    value={building}
                    placeholder="Building Code"
                    onChange={(e) => {
                      setBuilding(e.target.value);
                    }}
                />
                <label>What floor is the utility located?</label>
                <input
                    type="number"
                    value={floorNumber}
                    placeholder="Floor Number"
                    onChange={(e) => {
                      setFloorNumber(e.target.value);
                    }}
                />
                <label>Briefly describe the location.</label>
                <textarea
                    value={locationDesc}
                    placeholder="location description"
                    onChange={(e) => {
                      setLocationDesc(e.target.value);
                    }}
                    rows={4}
                    columns={20}
                />
                <select
                    onChange={(e) => setUtil(e.target.value)}
                    value={util}
                >
                  <option value="waterfountain">Water Fountain</option>
                  <option value="microwave">Microwave</option>
                  <option value="washroom">Washroom</option>
                </select>

                {util === "waterfountain" && (
                    <>
                      <label>Does it have Cold Water?</label>
                      <select
                          onChange={(e) => setHasColdWater(e.target.value)}
                          value={hasColdWater}
                      >
                        <option value="TRUE ">Yes</option>
                        <option value="FALSE">No</option>

                      </select>
                      <label>Does it have Hot Water?</label>
                      <select
                          onChange={(e) => setHasHotWater(e.target.value)}
                          value={hasHotWater}
                      >
                        <option value="TRUE ">Yes</option>
                        <option value="FALSE">No</option>
                      </select>
                    </>
                )}

                {util === "microwave" && (
                    <>
                      <label>Describe the size of the microwave.</label>
                      <input
                          type="text"
                          value={microwaveSize}
                          placeholder="Microwave Size"
                          onChange={(e) => {
                            setMicrowaveSize(e.target.value);
                          }}
                      />
                    </>
                )}

                {util === "washroom" && (
                    <>
                      <label>Gender of the washroom?</label>
                      <input
                          type="text"
                          value={gender}
                          placeholder="Gender"
                          onChange={(e) => {
                            setGender(e.target.value);
                          }}
                      />
                      <label>Number of stalls in the washroom?</label>
                      <input
                          type="number"
                          value={numStalls}
                          placeholder="Number of Stalls"
                          onChange={(e) => {
                            setNumStalls(e.target.value);
                          }}
                      />
                      <label>List any accessibility Features here.</label>
                      <textarea
                          value={accessibilityFeature}
                          placeholder="Accessibility Feature"
                          onChange={(e) => {
                            setAccessibilityFeature(e.target.value);
                          }}
                      />
                    </>
                )}


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
  const [update, setUpdate] = useState(true);
  const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = getCookie("isAdmin");
        console.log(isAdmin)
        if (isAdmin === "false") {
          navigate("/");
          return;
        }
      }, [navigate]);


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
  }, [update]);

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
