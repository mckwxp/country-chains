import React from "react";
import PropTypes from "prop-types";

function Players(props) {
    // add class to list item for current player (in order to add blinking outline)
    function isCurrentPlayer(i) {
        return props.countries.length % props.playersInRoom.length === i &&
            props.page === "GAME"
            ? " currentPlayer"
            : "";
    }

    function Player(p, i) {
        return (
            <li
                key={`player${i}`}
                className={`player${i}${isCurrentPlayer(i)}`}
            >
                {p.username}
            </li>
        );
    }

    const replayStyle = props.page === "REPLAY" ? "replay" : "";

    return (
        <div id="playersInRoom">
            <span className={replayStyle}>
                You are in Room {props.room}. <br />
            </span>
            Mode: {props.mode} <br />
            <span className={replayStyle}>
                Online players: {props.playersInRoom.length} <br />
            </span>
            <ul>{props.playersInRoom.map(Player)}</ul>
        </div>
    );
}

Players.propTypes = {
    page: PropTypes.string,
    room: PropTypes.number,
    playersInRoom: PropTypes.array,
    countries: PropTypes.array,
    mode: PropTypes.string,
};

export default Players;
