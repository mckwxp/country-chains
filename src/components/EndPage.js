import React from "react";

function EndPage(props) {
    props.setMsg("Your score is:");
    function handleClick() {
        props.setPage(props.pages.GAME);
        props.setMsg("Let's begin!");
        props.setCountries([]);
    }
    return (
        <div className="EndPage">
            <p>Thanks for playing!</p>
            <button type="button" className="btn" onClick={handleClick}>
                Play again!
            </button>
        </div>
    );
}

export default EndPage;
