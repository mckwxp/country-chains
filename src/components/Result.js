import React from "react";
import PropTypes from "prop-types";

function Result(props) {
    // converts the country list to a list
    // reverse the list so that most recent one is on top
    const countries = props.countries
        .map((c, i) => {
            return (
                <li
                    key={"country" + i}
                    className={"player" + (i % props.playersInRoom.length)}
                >
                    {c}
                </li>
            );
        })
        .slice(0)
        .reverse();

    return (
        <div id="Result">
            <ul>{countries}</ul>
        </div>
    );
}

Result.propTypes = {
    countries: PropTypes.array,
    playersInRoom: PropTypes.array,
};

export default Result;
