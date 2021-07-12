import React from "react";

function EndPage(props) {
    function handleClick() {
        props.setPage(props.pages.GAME);
        props.setMsg("Let's begin!");
        props.setCountries([]);
    }
    return (
        <div id="EndPage">
            <p>Thanks for playing!</p>
            <button type="button" className="btn" onClick={handleClick}>
                Play again!
            </button>
        </div>
    );
}

export default EndPage;
