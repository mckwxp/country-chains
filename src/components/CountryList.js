import React from "react";
import PropTypes from "prop-types";

function CountryList(props) {
    function Country(c, i) {
        return (
            <li
                key={"country" + i}
                className={"player" + (i % props.playersInRoom.length)}
            >
                {c}
            </li>
        );
    }

    const countries = props.countries.map(Country).slice(0).reverse();

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
