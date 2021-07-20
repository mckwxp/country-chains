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
                {props.playersInRoom.map((p) => {
                    return <li>{p.username}</li>;
                })}
            </ul>
        </div>
    );
}

Players.propTypes = {
    room: PropTypes.number,
    playersInRoom: PropTypes.array,
};

export default Players;
