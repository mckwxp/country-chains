import React from "react";
import PropTypes from "prop-types";

function Players(props) {
    function isCurrentPlayer(i) {
        return (
            props.countries.length % props.playersInRoom.length === i &&
            props.page === "GAME"
        );
    }
    return (
        <div id="playersInRoom">
            You are in Room {props.room}.
            <br />
            Mode: {props.mode}
            <br />
            Online players: {props.playersInRoom.length}
            <br />
            <ul>
                {props.playersInRoom.map((p, i) => (
                    <li
                        key={`player${i}`}
                        className={`player${i}${
                            isCurrentPlayer(i) ? " currentPlayer" : ""
                        }`}
                    >
                        {p.username}
                    </li>
                ))}
            </ul>
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
