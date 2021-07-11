import React from "react";

function StartPage(props) {
    function handleSubmit(e) {
        e.preventDefault();
        props.setPage(props.pages.GAME);
        props.setMsg("Let's begin!");
        props.setPlayers(e.target[0].value);
    }
    return (
        <div className="StartPage">
            <p>
                In this game, you will create a chain of <br /> neighbouring
                countries.
            </p>
            <form onSubmit={handleSubmit}>
                <select defaultValue={"DEFAULT"}>
                    <option value="DEFAULT" disabled>
                        Select the number of players:
                    </option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                </select>
                <button type="submit" className="btn">
                    Play now!
                </button>
            </form>
        </div>
    );
}

export default StartPage;
