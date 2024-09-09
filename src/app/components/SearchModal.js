import { useState } from "react";

const SearchModal = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const cities = ["Mumbai", "Pune", "Gujarat", "Bangalore", "Indore", "Bhopal"];

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="search-bar">
          <img
            src="../backwrrewBlack.png"
            onClick={onClose}
            style={{ width: "15px", marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ul className="city-list">
          {filteredCities.map((city, index) => (
            <li key={index}>{city}</li>
          ))}
        </ul>
        <div style={{ marginBottom: "10px" }}>
          <button className="search-button" onClick={onClose}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
