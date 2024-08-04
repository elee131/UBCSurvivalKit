import { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

// name, building, location, drinks
function CafePopUp(props) {
  const cafe = props.cafe;
  return (
    <div>
      <Popup trigger={<button> View Details </button>} modal nested>
        {(close) => (
          <div className="modal">
            <div>
              <button onClick={() => close()}> Close popup </button>
            </div>
            <div className="content">
              Building: {cafe.building}| Location: {cafe.location}
            </div>
            <h3> Drinks: </h3>
            {cafe.drinks.map((drink) => (
              <div>
                <p> {drink} </p>
              </div>
            ))}
          </div>
        )}
      </Popup>
    </div>
  );
}

export default CafePopUp;
