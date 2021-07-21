import React from "react";
import PropTypes from "prop-types";

function Players(props) {
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
                                props.countries.length %
                                    props.playersInRoom.length ===
                                i
                                    ? " currentPlayer"
                                    : ""
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
    room: PropTypes.number,
    playersInRoom: PropTypes.array,
    countries: PropTypes.array,
};

export default Players;
