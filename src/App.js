import "./App.css";
import React, { useState } from "react";
import Info from "./components/Info.js";
import Form from "./components/Form.js";
import Result from "./components/Result.js";
import StartPage from "./components/StartPage.js";
import EndPage from "./components/EndPage.js";
import Map from "./components/Map.js";

function App() {
    // Data for country neighbours
    let myjson = require("./countries.json");

    // Checks if the second country is a neighbour of the first country
    function checkNeighbours(first, second) {
        const searchResults = myjson.find(
            (c) => c.country.toLowerCase() === first.toLowerCase()
        );
        return searchResults
            ? searchResults.neighbours
                  .map((x) => x.toLowerCase())
                  .includes(second.toLowerCase())
            : false;
    }

    // Checks if a country is in the data object
    function checkCountry(country) {
        const searchResults = myjson.find(
            (c) => c.country.toLowerCase() === country.toLowerCase()
        );
        return searchResults ? true : false;
    }

    // State for messsage panel
    const [msg, setMsg] = useState("Welcome to the game!");

    // State for results panel; contains an array of countries
    const [countries, setCountries] = useState([]);

    // State for latest country to add to the map
    const [latestCountry, setLatestCountry] = useState("");

    // Core logic to check if the entered country is a neighbour of the most recent one
    // Sets message panel and results panel accordingly
    // Returns Boolean to indicate if country is successfully added to the array
    function addCountry(countryName) {
        // check validity of entered country name
        if (!checkCountry(countryName)) {
            setMsg(`${countryName} is not a valid country`);
            return false;
        } else {
            // array already populated; not the first added country
            if (countries.length > 0) {
                if (
                    checkNeighbours(
                        countries[countries.length - 1],
                        countryName
                    )
                ) {
                    setCountries([...countries, countryName]);
                    setLatestCountry(countryName);
                    setMsg("Well done! Keep going!");
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
                // first added country
                setCountries([countryName]);
                setLatestCountry(countryName);
                setMsg("Great start!");
                return true;
            }
        }
    }

    const [page, setPage] = useState(0);
    const pages = { START: 0, GAME: 1, END: 2 };

    function Main() {
        if (page === pages.START) {
            return (
                <StartPage setPage={setPage} pages={pages} setMsg={setMsg} />
            );
        } else if (page === pages.GAME) {
            return (
                <div className="main-container">
                    <div className="game">
                        <Form
                            addCountry={addCountry}
                            setPage={setPage}
                            pages={pages}
                        />
                        <Result countries={countries} />
                    </div>
                    <Map country={latestCountry} />
                </div>
            );
        } else if (page === pages.END) {
            return (
                <EndPage
                    setMsg={setMsg}
                    setPage={setPage}
                    pages={pages}
                    setCountries={setCountries}
                />
            );
        }
    }

    const score = [countries.length, [...new Set(countries)].length];
    return (
        <div className="App">
            <header className="App-header">🔗Country Chains🔗</header>
            <Info msg={msg} score={score} />
            {Main() /* reason for this: https://stackoverflow.com/a/65328486 */}
            <footer className="App-footer">
                <a
                    href="https://github.com/mckwxp/country-chains"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Source code on GitHub
                </a>
            </footer>
        </div>
    );
}

export default App;
