import React from "react";

function StartPage(props) {
    function handleClick() {
        props.setPageFunc(props.pages.GAME);
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
