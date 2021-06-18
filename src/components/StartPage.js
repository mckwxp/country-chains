import React from "react";

function StartPage(props) {
    function handleClick() {
        props.setPage(props.pages.GAME);
        props.setMsg("Let's begin!");
    }
    return (
        <div className="StartPage">
            <div>
                In this game, you will create a chain of neighbouring countries.
            </div>
            <button type="button" className="btn" onClick={handleClick}>
                Play now!
            </button>
        </div>
    );
}

export default StartPage;
