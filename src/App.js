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

    // checkNeighbours(["Ghana", "Togo"]);

    return (
        <div className="App">
            <header className="App-header">🔗Country Chains🔗</header>
            <Info msg="Welcome to the game!" />
            <Form
                checkNeighboursFunc={checkNeighbours}
                checkCountryFunc={checkCountry}
            />
        </div>
    );
}

export default App;
