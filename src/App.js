import "./App.css";
import React, { useEffect, useState } from "react";
import Info from "./components/Info.js";
import Game from "./components/Game.js";
import Players from "./components/Players.js";
import StartPage from "./components/StartPage.js";
import EndPage from "./components/EndPage.js";
import Map from "./components/Map.js";
import { socket } from "./components/socket.js";

function App() {
    const [mode, setMode] = useState("Land");

    // Data for country neighbours
    const myjson =
        mode === "Land"
            ? require("./countries_land.json")
            : mode === "Land and maritime"
            ? require("./countries_maritime.json")
            : alert(`No such mode ${mode}`);

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

    // State for players present in room
    const [playersInRoom, setPlayersInRoom] = useState([]);

    // State for current username
    const [username, setUsername] = useState("");

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

    const [page, setPage] = useState("START");

    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState(null);

    const [spectate, setSpectate] = useState(false);
    const [connected, setConnected] = useState(true);

    function MapAndPlayers() {
        return (
            <>
                <Map countries={countries} playersInRoom={playersInRoom} />
                <Players
                    page={page}
                    room={room}
                    playersInRoom={playersInRoom}
                    countries={countries}
                    mode={mode}
                />
            </>
        );
    }

    function Main() {
        if (page === "START") {
            return (
                <StartPage
                    setPage={setPage}
                    setMsg={setMsg}
                    mode={mode}
                    setMode={setMode}
                    setCountries={setCountries}
                    rooms={rooms}
                    room={room}
                    setRoom={setRoom}
                    username={username}
                    setUsername={setUsername}
                    setSpectate={setSpectate}
                />
            );
        } else if (page === "GAME") {
            return (
                <div id="main-container">
                    <Game
                        addCountry={addCountry}
                        countries={countries}
                        setPage={setPage}
                        setMsg={setMsg}
                        room={room}
                        username={username}
                        playersInRoom={playersInRoom}
                        spectate={spectate}
                    />
                    {MapAndPlayers() /* avoid map re-render */}
                </div>
            );
        } else if (page === "END") {
            return (
                <div id="main-container">
                    <EndPage
                        setMsg={setMsg}
                        setPage={setPage}
                        setCountries={setCountries}
                        room={room}
                        setRoom={setRoom}
                    />
                    {MapAndPlayers() /* avoid map re-render */}
                </div>
            );
        }
    }

    const score = [countries.length, [...new Set(countries)].length];

    // add socket listeners
    useEffect(() => {
        socket.on("updateRooms", (msg) => {
            setRooms(msg);
        });
        socket.on("updatePlayersInRoom", (msg) => {
            setPlayersInRoom(msg);
        });
        socket.on("begin", (msg) => {
            setCountries(msg);
        });
        socket.on("end", () => {
            setPage("END");
            setMsg("Your score is:");
        });
        socket.on("reply", (msg) => setCountries(msg));
        socket.on("connect", () => setConnected(true));
        socket.on("disconnect", () => setConnected(false));
    }, []);

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
                <span>
                    {connected
                        ? "Connected to server"
                        : "Disconnected from server"}
                </span>
            </footer>
        </div>
    );
}

export default App;
