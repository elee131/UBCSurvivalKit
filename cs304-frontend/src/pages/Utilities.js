import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Style.css";
import "./Utilities.css";
import PopUp from "./PopUp";

function Util({ util, detailed }) {
    const determineType = (id) => {
        if (id >= 10000000 && id < 20000000) return 'Washroom';
        if (id >= 20000000 && id < 30000000) return 'Microwave';
        if (id >= 30000000 && id < 40000000) return 'Water Fountain';
        return 'Unknown';
    };

    return (
        <div className="utilities">
            <p>Type: {determineType(util.utilityID)}</p>
            <p>Rating: {util.overallRating}</p>
            <p>Located: {util.buildingCode}</p>
            <p>Image: {util.imageURL || 'N/A'}</p>
            <p>Hours: {util.operatingHours}</p>

            {detailed && (
                <label>
                    <PopUp util={util} />
                </label>
            )}
        </div>
    );
}

function SimpleUtil({ util, detailed }) {
    const determineType = (id) => {
        if (id >= 10000000 && id < 20000000) return 'Washroom';
        if (id >= 20000000 && id < 30000000) return 'Microwave';
        if (id >= 30000000 && id < 40000000) return 'Water Fountain';
        return 'Unknown';
    };

    return (
        <div className="utilities">
            <p>Type: {determineType(util.utilityID)}</p>
            <p>Located: {util.buildingCode}</p>
            <p>Hours: {util.operatingHours}</p>

            {detailed && (
                <label>
                    <PopUp util={util} />
                </label>
            )}
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
            console.log(result.data);

            if (result.success && !showSimple) {
                const formattedData = result.data.map(item => ({
                    utilityID: item[0],
                    overallRating: item[1],
                    buildingCode: item[2],
                    imageURL: item[3],
                    operatingHours: item[4],
                }));
                setUtilities(formattedData);
                console.log(utilities);
            } else if (result.success) {
                const formattedData = result.data.map(item => ({
                    utilityID: item[0],
                    buildingCode: item[1],
                    operatingHours: item[2],
                }));
                setUtilities(formattedData);
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

            if (showSimple) {
                const formattedData = data.data.map(item => ({
                    utilityID: item[0],
                    buildingCode: item[1],
                    operatingHours: item[2],
                }));
                setUtilities(formattedData);

            } else {
                const formattedData = data.data.map(item => ({
                    utilityID: item[0],
                    overallRating: item[1],
                    buildingCode: item[2],
                    imageURL: item[3],
                    operatingHours: item[4],
                }));
                setUtilities(formattedData);
            }
        } catch (error) {
            console.error("Error fetching utilities:", error);
        }
    };

    useEffect(() => {
        fetchUtilities();
    }, [showWash, showWater, showMicro, showSimple]);

    const handleSearchClick = () => {
        searchWithBuildingCode();
    };

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
                        onChange={(e) => setBuildingCode(e.target.value)}
                    />
                </label>
                <button onClick={handleSearchClick}>Search</button>
            </div>

            <div className="utilities-container">
                {utilities.map((util) => {
                    return showSimple ? (
                        <SimpleUtil key={util.utilityID} util={util} detailed={!showSimple} />
                    ) : (
                        <Util key={util.utilityID} util={util} detailed={!showSimple} />
                    );
                })}
            </div>
        </div>
    );
}

export default App;
