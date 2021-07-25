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
    const [mode, setMode] = useState("Land"); // game mode state
    const [msg, setMsg] = useState("Welcome to the game!"); // message panel state
    const [countries, setCountries] = useState([]); // result panel state
    const [playersInRoom, setPlayersInRoom] = useState([]); // players-in-room state
    const [username, setUsername] = useState(""); // player name state
    const [page, setPage] = useState("START"); // game page state
    const [rooms, setRooms] = useState([]); // room list state
    const [room, setRoom] = useState(null); // current room state
    const [spectate, setSpectate] = useState(false); // spectator state
    const [connected, setConnected] = useState(true); // server connection state

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
                        countries={countries}
                        setCountries={setCountries}
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
                        countries={countries}
                        playersInRoom={playersInRoom}
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
            {Main() /* reason: https://stackoverflow.com/a/65328486 */}
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
