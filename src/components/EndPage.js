import React from "react";
import PropTypes from "prop-types";

function EndPage(props) {
    function handleClick() {
        props.setPage(props.pages.START);
        props.setMsg("Welcome to the game!");
        props.setCountries([]);
        props.setRoom(null);
    }
    return (
        <div id="EndPage">
            <p>Thanks for playing!</p>
            <button type="button" onClick={handleClick}>
                Play again!
            </button>
        </div>
    );
}

EndPage.propTypes = {
    setMsg: PropTypes.func,
    setPage: PropTypes.func,
    pages: PropTypes.object,
    setCountries: PropTypes.func,
    room: PropTypes.number,
    setRoom: PropTypes.func,
};

export default EndPage;
