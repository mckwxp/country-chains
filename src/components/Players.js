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
            Online players: {props.playersInRoom.length}
            <br />
            <ul>
                {props.playersInRoom.map((p, i) => {
                    return (
                        <li
                            className={`player${i}${
                                isCurrentPlayer(i) ? " currentPlayer" : ""
                            }`}
                        >
                            {p.username}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

Players.propTypes = {
    page: PropTypes.string,
    room: PropTypes.number,
    playersInRoom: PropTypes.array,
    countries: PropTypes.array,
};

export default Players;
