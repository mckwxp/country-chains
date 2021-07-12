import React from "react";

function StartPage(props) {
    function handleSubmit(e) {
        e.preventDefault();
        props.setPage(props.pages.GAME);
        props.setMsg("Let's begin!");
    }
    function onValueChange(e) {
        props.setPlayers(parseInt(e.target.value));
    }
    return (
        <div className="StartPage">
            <p>
                In this game, you will create a chain of <br /> neighbouring
                countries.
            </p>
            <form onSubmit={handleSubmit}>
                Select the number of players:
                <div>
                    <input
                        type="radio"
                        id="numPlayers1"
                        value={1}
                        checked={props.players === 1}
                        onChange={onValueChange}
                    />
                    <label>1</label>
                    <input
                        type="radio"
                        id="numPlayers2"
                        value={2}
                        checked={props.players === 2}
                        onChange={onValueChange}
                    />
                    <label>2</label>
                    <input
                        type="radio"
                        id="numPlayers3"
                        value={3}
                        checked={props.players === 3}
                        onChange={onValueChange}
                    />
                    <label>3</label>
                    <input
                        type="radio"
                        id="numPlayers4"
                        value={4}
                        checked={props.players === 4}
                        onChange={onValueChange}
                    />
                    <label>4</label>
                </div>
                <button type="submit" className="btn">
                    Play now!
                </button>
            </form>
        </div>
    );
}

export default StartPage;
