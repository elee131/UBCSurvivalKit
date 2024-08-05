import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Style.css";
import "./Utilities.css";
import PopUp from "./PopUp";

function Util(prop) {
    const util = prop.util;
    return (
        <div className = "utilities">
            <p>Type: {util.type}</p>
            <p>Rating: {util.rating}</p>
            <p>
                Located: {util.building} {util.location}
            </p>
            <label>
                The popup is just a placeholder
                <PopUp util={testUtil} />
            </label>
        </div>
    );
}

function App() {
    const [showWash, setShowWash] = useState(true);
    const [showWater, setShowWater] = useState(true);
    const [showMicro, setShowMicro] = useState(true);
    const [showSimple, setShowSimple] = useState(false);
    const [buildingCode, setBuildingCode] = useState("");
    const [utilities, setUtilities] = useState([]);

    const fetchUtilities = async () => {
        const queryString = new URLSearchParams({
            wrClicked: showWash,
            mClicked: showMicro,
            wfClicked: showWater,
        }).toString();

        try {
            const endpoint = showSimple
                ? `/requested-utilities-simple?` + queryString
                : `/requested-utilities?` + queryString;

            console.log(endpoint);

            const response = await fetch(endpoint, {
                method: "GET",

            });
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }


            const result = await response.json();
            console.log(result);

            if (result.success) {
                setUtilities(transformedData);
            } else {
                console.error("Error from server:", result.message);
            }
        } catch (error) {
            console.error("Error fetching utilities:", error);
        }
    };


    const searchWithBuildingCode = async () => {
        const queryString = new URLSearchParams({
            buildingCode: buildingCode,
            wrClicked: showWash,
            mClicked: showMicro,
            wfClicked: showWater
        }).toString();

        try {
            const endpoint = `/utils-at-building?${queryString}`;
            const response = await fetch(endpoint);
            const data = await response.json();
            setUtilities(data);
        } catch (error) {
            console.error("Error fetching utilities:", error);
        }
    };

    useEffect(() => {
        fetchUtilities();
    }, [showWash, showWater, showMicro, showSimple]);

    useEffect(() => {
        if (buildingCode) {
            searchWithBuildingCode();
        }
    }, [buildingCode, showWash, showWater, showMicro, showSimple]);

    return (
        <div className="container">
            <div className="Navbar">
                <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                    Home
                </Link>
            </div>

            <div className="checkbox-container">
                <div className="utility">
                    <label>
                        Washrooms
                        <input
                            type="checkbox"
                            checked={showWash}
                            onChange={() => setShowWash(!showWash)}
                        />
                    </label>
                    <label>
                        Water Fountains
                        <input
                            type="checkbox"
                            checked={showWater}
                            onChange={() => setShowWater(!showWater)}
                        />
                    </label>
                    <label>
                        Microwaves
                        <input
                            type="checkbox"
                            checked={showMicro}
                            onChange={() => setShowMicro(!showMicro)}
                        />
                    </label>
                    <label>
                        Simple View
                        <input
                            type="checkbox"
                            checked={showSimple}
                            onChange={() => setShowSimple(!showSimple)}
                        />
                    </label>
                </div>

                <label className="building">
                    Building:
                    <input
                        type="text"
                        value={buildingCode}
                        onChange={(e) => {
                            setBuildingCode(e.target.value);
                            searchWithBuildingCode(); // Trigger search on change
                        }}
                    />
                </label>
            </div>

            <div className="utilities-container">
                {utilities.map((util) => {
                    if (
                        buildingCode !== "" &&
                        buildingCode.toLowerCase() !== util.buildingCode.toLowerCase()
                    ) {
                        return null;
                    }
                    return <Util key={util.utilID} util={util} detailed={!showSimple}/>;
                })}
            </div>
        </div>
    );
}

export default App;
