import React from "react";

function EndPage(props) {
    props.setMsg("Thanks for playing!");
    function handleClick() {
        props.setPage(props.pages.GAME);
        props.setMsg("Let's begin!");
        props.setCountries([]);
    }
    return (
        <div className="EndPage">
            <button type="button" className="btn" onClick={handleClick}>
                Play again!
            </button>
        </div>
    );
}

export default EndPage;
