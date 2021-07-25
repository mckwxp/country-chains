import React from "react";
import PropTypes from "prop-types";
import CountryList from "./CountryList.js";

function EndPage(props) {
    function handleClick() {
        props.setPage("START");
        props.setMsg("Welcome to the game!");
        props.setCountries([]);
        props.setRoom(null);
    }

    return (
        <div id="EndPage">
            <div>
                <p>Thanks for playing!</p>
                <button type="button" onClick={handleClick}>
                    Play again!
                </button>
            </div>
            <CountryList
                countries={props.countries}
                playersInRoom={props.playersInRoom}
            />
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
