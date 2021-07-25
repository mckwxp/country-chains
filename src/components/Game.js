import React, { useState } from "react";
import PropTypes from "prop-types";
import CountryList from "./CountryList.js";
import { socket } from "./socket.js";

function Game(props) {
    const [name, setName] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (props.spectate) {
            alert("You cannot play the game as a spectator");
            return;
        } else if (
            props.playersInRoom.findIndex(
                (x) => x.username === props.username
            ) !==
            props.countries.length % props.playersInRoom.length
        ) {
            alert("It's not your turn");
            return;
        }
        const countryName = name.trim();
        if (countryName !== "") {
            let newCountry = props.addCountry(countryName);
            if (newCountry) {
                setName("");
                socket.emit("message", {
                    roomID: props.room,
                    country: newCountry,
                });
            }
        }
    }

    function handleChange(e) {
        setName(e.target.value);
    }

    function handleClick() {
        if (props.spectate) {
            alert("You cannot play the game as a spectator");
            return;
        }
        if (
            window.confirm(
                "Are you sure you want to finish? The room will be closed."
            )
        ) {
            props.setPage("END");
            props.setMsg("Your score is:");
            socket.emit("end", {
                roomID: props.room,
            });
        }
    }

    return (
        <div id="game">
            <div id="Form">
                <form onSubmit={handleSubmit} autoComplete="off">
                    <p>Enter a country name:</p>
                    <input
                        type="text"
                        autoComplete="off"
                        value={name}
                        onChange={handleChange}
                    />
                    <button type="submit">Chain it!</button>
                </form>
                <div>
                    <button type="button" onClick={handleClick}>
                        Finish
                    </button>
                </div>
            </div>
            <CountryList
                countries={props.countries}
                playersInRoom={props.playersInRoom}
            />
        </div>
    );
}

Game.propTypes = {
    addCountry: PropTypes.func,
    countries: PropTypes.array,
    setPage: PropTypes.func,
    setMsg: PropTypes.func,
    room: PropTypes.number,
    username: PropTypes.string,
    playersInRoom: PropTypes.array,
    spectate: PropTypes.bool,
};

export default Game;
