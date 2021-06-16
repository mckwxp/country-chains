import "./App.css";
import React, { useState } from "react";
import Info from "./components/Info.js";
import Form from "./components/Form.js";

function App() {
    let myjson = require("./countries.json");

    function checkNeighbours(first, second) {
        const searchResults = myjson.find((c) => c.country === first);
        return searchResults
            ? searchResults.neighbours.includes(second)
            : false;
    }

    function checkCountry(country) {
        const searchResults = myjson.find((c) => c.country === country);
        return searchResults ? true : false;
    }

    const [countries, setCountries] = useState([]);

    function addCountry(countryName) {
        if (!checkCountry(countryName)) {
            alert(`${countryName} is not a valid country`);
            return false;
        } else {
            if (countries.length > 0) {
                if (
                    checkNeighbours(
                        countries[countries.length - 1],
                        countryName
                    )
                ) {
                    setCountries([...countries, countryName]);
                    return true;
                } else {
                    alert(
                        `${countryName} is not a neighbour of ${
                            countries[countries.length - 1]
                        }`
                    );
                    return false;
                }
            } else {
                setCountries([...countries, countryName]);
                return true;
            }
        }
    }

    return (
        <div className="App">
            <header className="App-header">🔗Country Chains🔗</header>
            <Info msg="Welcome to the game!" />
            <Form addCountryFunc={addCountry} />
        </div>
    );
}

export default App;
