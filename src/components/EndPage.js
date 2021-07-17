import React from "react";
import PropTypes from "prop-types";
import { socket } from "./socket.js";

function EndPage(props) {
    function handleClick() {
        socket.emit("finish");
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
};

export default EndPage;
