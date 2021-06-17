import "./App.css";
import React, { useState } from "react";
import Info from "./components/Info.js";
import Form from "./components/Form.js";
import Result from "./components/Result.js";

function App() {
    const [msg, setMsg] = useState("Welcome to the game!");

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
            setMsg(`${countryName} is not a valid country`);
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
                    setMsg(
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
            <Info msg={msg} />
            <Form addCountryFunc={addCountry} />
            <Result countries={countries} />
            <footer className="App-footer">
                <a href="https://github.com/mckwxp/country-chains">
                    Source code on GitHub
                </a>
            </footer>
        </div>
    );
}

export default App;
