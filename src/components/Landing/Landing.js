import { useState } from "react";
import "./Landing.css";
import { useNavigate } from "react-router-dom";
import { updateFilters } from './landingSlice'
import { useDispatch } from 'react-redux'
// import { useGetLavsQuery } from "../../apicalls";

export default function Landing() {
  const [currentLocation, setCurrentLocation] = useState(false);
  const [currentCoords, setCurrentCoords] = useState("")
  const [zipcode, setZipcode] = useState("");
  const [adaAccessible, setAdaAccessible] = useState(false);
  const [unisex, setUnisex] = useState(false);
  const [changingTable, setChangingTable] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const successCallback = (position) => {
    console.log(position.coords.latitude, position.coords.longitude);
    setCurrentLocation(true)
    setCurrentCoords({ 'lat':`${position.coords.latitude}`, 'long':`${position.coords.longitude}`})
  };
  
  const errorCallback = (error) => {
    alert(error);
  };

  const getUserLocation = () => {
    if (currentCoords) {
      setCurrentLocation(false);
      setCurrentCoords("");
      return;
    }
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    // Probably will need to invoke a loading state here as it seems to take about 5 seconds to return location
    // Also will need to block form submission with a checker function
  }

  const checkInputs = () => {
    if (!(currentCoords || zipcode)) {
      alert("Please make sure to select current location or enter a zipcode before searching.")
      return;
    } else {
      dispatch(updateFilters({ currentLocation, currentCoords, zipcode, adaAccessible, unisex, changingTable }));
      navigate('/results');
    }
  }

  return (
    <section className="landing-main">
      <section className="landing-content">
        <section className="landing-header">
          <h1 className="site-title">Lav Link</h1>
          <p>find safer relief near you</p>
          <img
            className="landing-toilet-icon"
            src="/assets/toilet.png"
            alt="toilet icon"
          />
        </section>
        <div className="current-location-button">
          <input
            name="currentLocation"
            type="checkbox"
            checked={currentLocation}
            onChange={() => getUserLocation()}
          />
          <label htmlFor="currentLocation">use current location</label>
        </div>
        <p>or</p>
        <input
          name="zipcodeInput"
          type="text"
          className="zipcode-input"
          placeholder="zipcode..."
          maxLength={5}
          value={zipcode}
          onChange={(event) => setZipcode(event.target.value)}
        />
        <section className="filter-section">
          <div className="ada-filter">
            <input
              name="adaAccessible"
              type="checkbox"
              checked={adaAccessible}
              onChange={(event) => setAdaAccessible(event.target.checked)}
            />
            {/* eslint-disable-next-line */}
            <img className="wheelchair-icon" src="/assets/wheelchair.png" />
            <label htmlFor="adaAccessible">ada accessible</label>
          </div>
          <div className="unisex-filter">
            <input
              name="unisex"
              type="checkbox"
              checked={unisex}
              onChange={(event) => setUnisex(event.target.checked)}
            />
            {/* eslint-disable-next-line */}
            <img className="unisex-icon" src="/assets/transgender.png" />
            <label htmlFor="unisex">unisex</label>
          </div>
          <div className="changing-table-filter">
            <input
              name="changingTable"
              type="checkbox"
              checked={changingTable}
              onChange={(event) => setChangingTable(event.target.checked)}
            />
            {/* eslint-disable-next-line */}
            <img className="baby-icon" src="/assets/baby.png" />
            <label htmlFor="changingTable">changing table</label>
          </div>
        </section>
        {/* <NavLink to="/results"> */}
          <button name="searchButton" className="search-button" onClick={() => checkInputs()} >search</button>
        {/* </NavLink> */}
      </section>
    </section>
  );
}
