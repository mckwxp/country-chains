import React from "react";
import PropTypes from "prop-types";

function CountryList(props) {
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
        <div id="Result">
            <ul>{countries}</ul>
        </div>
    );
}

CountryList.propTypes = {
    countries: PropTypes.array,
    playersInRoom: PropTypes.array,
};

export default CountryList;
