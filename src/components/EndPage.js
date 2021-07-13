import React from "react";
import PropTypes from "prop-types";

function EndPage(props) {
    function handleClick() {
        props.setPage(props.pages.GAME);
        props.setMsg("Let's begin!");
        props.setCountries([]);
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
