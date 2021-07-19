import "./App.css";
import React, { useEffect, useState } from "react";
import Info from "./components/Info.js";
import Form from "./components/Form.js";
import Result from "./components/Result.js";
import StartPage from "./components/StartPage.js";
import EndPage from "./components/EndPage.js";
import Map from "./components/Map.js";
import { socket } from "./components/socket.js";
import html2canvas from "html2canvas";

function App() {
    const [mode, setMode] = useState("land");

    // Data for country neighbours
    const myjson =
        mode === "land"
            ? require("./countries_land.json")
            : require("./countries_maritime.json");

    // Checks if the second country is a neighbour of the first country
    function checkNeighbours(first, second) {
        const searchResults = myjson.find(
            (c) => c.country.toLowerCase() === first.toLowerCase()
        );

        if (searchResults) {
            let filteredNeighbours = searchResults.neighbours.filter(
                (x) => x.toLowerCase() === second.toLowerCase()
            );
            if (filteredNeighbours.length !== 0) {
                return true;
            }
        }
    }

    // Checks if a country has a neighbour
    function checkNeighbourExists(country) {
        const searchResults = myjson.find(
            (c) => c.country.toLowerCase() === country.toLowerCase()
        );
        return searchResults ? searchResults.neighbours.length !== 0 : false;
    }

    // Checks if a country is in the data object
    function checkCountry(country) {
        const searchResults = myjson.find(
            (c) => c.country.toLowerCase() === country.toLowerCase()
        );
        return searchResults ? searchResults.country : false;
    }

    // Data for country name synonyms
    const synonyms = require("./countries_synonyms.json");

    // Checks for synonym of country names
    function checkSynonyms(country) {
        const searchResults = synonyms.find((c) =>
            c.synonyms
                .map((x) => x.toLowerCase())
                .includes(country.toLowerCase())
        );
        return searchResults ? searchResults.country : country;
    }

    // State for messsage panel
    const [msg, setMsg] = useState("Welcome to the game!");

    // State for results panel; contains an array of countries
    const [countries, setCountries] = useState([]);

    // State for number of players
    const [players, setPlayers] = useState(1);

    // Core logic to check if the entered country is a neighbour of the most recent one
    // Sets message panel and results panel accordingly
    // Returns Boolean to indicate if country is successfully added to the array
    function addCountry(countryName) {
        // check for synonyms and coutnry name validity
        countryName = checkSynonyms(countryName);
        countryName = checkCountry(countryName);

        if (!countryName) {
            setMsg(`This is not a valid country.`);
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
                    return countryName;
                } else {
                    setMsg(
                        `${countryName} is not a neighbour of ${
                            countries[countries.length - 1]
                        }.`
                    );
                    return false;
                }
            } else {
                // first added country
                if (checkNeighbourExists(countryName)) {
                    setCountries([countryName]);
                    setMsg("Great start!");
                    return countryName;
                } else {
                    setMsg(
                        "This country does not have any neighbours. Please name another one."
                    );
                    return false;
                }
            }
        }
    }

    const [page, setPage] = useState(0);
    const pages = { START: 0, GAME: 1, END: 2 };

    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState(null);

    function Main() {
        if (page === pages.START) {
            return (
                <StartPage
                    setPage={setPage}
                    pages={pages}
                    setMsg={setMsg}
                    players={players}
                    setPlayers={setPlayers}
                    mode={mode}
                    setMode={setMode}
                    setCountries={setCountries}
                    rooms={rooms}
                    room={room}
                    setRoom={setRoom}
                />
            );
        } else if (page === pages.GAME) {
            return (
                <div id="main-container">
                    <div id="game">
                        <Form
                            addCountry={addCountry}
                            countries={countries}
                            setPage={setPage}
                            setMsg={setMsg}
                            pages={pages}
                            room={room}
                        />
                        <Result countries={countries} players={players} />
                    </div>
                    <Map countries={countries} players={players} />
                </div>
            );
        } else if (page === pages.END) {
            return (
                <div id="main-container">
                    <EndPage
                        setMsg={setMsg}
                        setPage={setPage}
                        pages={pages}
                        setCountries={setCountries}
                        room={room}
                        setRoom={setRoom}
                    />
                    <Map countries={countries} players={players} />
                </div>
            );
        }
    }

    const score = [countries.length, [...new Set(countries)].length];

    useEffect(() => {
        socket.on("updateRooms", (msg) => {
            setRooms(msg);
        });
        socket.on("joinFailed", (msg) => {
            console.log("Failed to join room");
        });
        socket.on("begin", (msg) => {
            setCountries(msg);
        });
        socket.on("end", () => {
            setPage(pages.END);
            setMsg("Your score is:");
        });
        socket.on("reply", (msg) => setCountries(msg));
    });

    function saveScreenshot() {
        html2canvas(document.body, {
            proxy: "/proxy",
        }).then((canvas) => {
            let link = document.createElement("a");
            if (typeof link.download === "string") {
                link.href = canvas.toDataURL();
                link.download = "screenshot.png";
                link.click();
            } else {
                window.open(canvas.toDataURL());
            }
        });
    }

    return (
        <div id="App">
            <header>🔗Country Chains🔗</header>
            <Info msg={msg} score={score} />
            {Main() /* reason for this: https://stackoverflow.com/a/65328486 */}
            <footer>
                <a
                    href="https://github.com/mckwxp/country-chains"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Source code on GitHub
                </a>
            </footer>
            <div id="screenshot">
                <button onClick={saveScreenshot}>
                    <img
                        src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmZmZmIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMuMiIvPgogICAgPHBhdGggZD0iTTkgMkw3LjE3IDRINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNmMxLjEgMCAyLS45IDItMlY2YzAtMS4xLS45LTItMi0yaC0zLjE3TDE1IDJIOXptMyAxNWMtMi43NiAwLTUtMi4yNC01LTVzMi4yNC01IDUtNSA1IDIuMjQgNSA1LTIuMjQgNS01IDV6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo="
                        alt="Take a screenshot"
                    />
                </button>
            </div>
        </div>
    );
}

export default App;
