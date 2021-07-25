import React from "react";
import PropTypes from "prop-types";

function EndPage(props) {
    function handleClick() {
        props.setPage("START");
        props.setMsg("Welcome to the game!");
        props.setCountries([]);
        props.setRoom(null);
    }

    const countries = props.countries
        .map((c, i) => (
            <li
                key={"country" + i}
                className={"player" + (i % props.playersInRoom.length)}
            >
                {c}
            </li>
        ))
        .slice(0)
        .reverse();

    return (
        <div id="EndPage">
            <div>
                <p>Thanks for playing!</p>
                <button type="button" onClick={handleClick}>
                    Play again!
                </button>
            </div>
            <div id="Result">
                <ul>{countries}</ul>
            </div>
        </div>
    );
}

EndPage.propTypes = {
    setMsg: PropTypes.func,
    setPage: PropTypes.func,
    setCountries: PropTypes.func,
    room: PropTypes.number,
    setRoom: PropTypes.func,
    countries: PropTypes.array,
    playersInRoom: PropTypes.array,
};

export default EndPage;
