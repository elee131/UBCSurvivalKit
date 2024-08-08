import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "./Style.css";

function App() {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [error, setError] = useState(null);
    const [tableName, setTableName] = useState("");
    const [attributes, setAttributes] = useState("");

    const handleSearchClick = async () => {
        try {
            const query = new URLSearchParams({ tableName, attributes }).toString();
            const response = await fetch(`/generic-projection?${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            if (result.success) {
                setData(result.data);
                setColumns(result.columns);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Error fetching data');
        }
    };

    return (
        <div className="container">
            <div className="Navbar">
                <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                    Home
                </Link>
            </div>

            <div className="checkbox-container">
                <label className="tableName">
                    <h2>TableName</h2>

                    <br/>
                    Available TableNames(must match case exactly):
                    <br/>
                    Location, Building, Rating, Image, Drink, Utility, UserInfo,
                    <br/>
                    Request, Cafe, Serves, Hours, Washroom, Microwave,
                    <br/>
                    WaterFountain, AverageRating, Review
                    <br/>

                    <input
                        type="text"
                        value={tableName}
                        onChange={(e) => setTableName(e.target.value)}
                        style={{marginTop: '10px', padding: '5px'}}
                    />
                </label>
                <label className="Attributes">
                    <h2>Attributes</h2>
                    <br/>
                    Attributes must be entered in a comma-separated list without whitespaces.
                    <br/>
                    <input
                        type="text"
                        value={attributes}
                        onChange={(e) => setAttributes(e.target.value)}
                        style={{marginTop: '10px', padding: '5px'}}
                    />
                </label>
                <button
                    onClick={handleSearchClick}
                    className="search-button"
                >
                    Search
                </button>
            </div>

            <div className="resultTable">
                {error ? (
                    <div>Error: {error}</div>
                ) : (
                    <table>
                    <thead>
                        <tr>
                            {columns.map(column => (
                                <th key={column}>{column}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default App;
