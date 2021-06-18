import "./App.css";
import React, { useState } from "react";
import Info from "./components/Info.js";
import Form from "./components/Form.js";
import Result from "./components/Result.js";
import StartPage from "./components/StartPage.js";
import EndPage from "./components/EndPage.js";

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
                setMsg("Great start to the game!");
                return true;
            }
        }
    }

    const [page, setPage] = useState(0);
    const pages = { START: 0, GAME: 1, END: 2 };

    function Main() {
        if (page === pages.START) {
            return (
                <>
                    <StartPage setPageFunc={setPage} pages={pages} />
                </>
            );
        } else if (page === pages.GAME) {
            return (
                <>
                    <Form
                        addCountryFunc={addCountry}
                        setPageFunc={setPage}
                        pages={pages}
                    />
                    <Result countries={countries} />
                </>
            );
        } else if (page === pages.END) {
            return (
                <>
                    <EndPage />
                </>
            );
        }
    }

    return (
        <div className="App">
            <header className="App-header">🔗Country Chains🔗</header>
            <Info
                msg={msg}
                score={[countries.length, [...new Set(countries)].length]}
            />
            <Main />
            {/* <Form addCountryFunc={addCountry} />
            <Result countries={countries} /> */}
            <footer className="App-footer">
                <a href="https://github.com/mckwxp/country-chains">
                    Source code on GitHub
                </a>
            </footer>
        </div>
    );
}

export default App;
