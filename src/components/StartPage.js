import React from "react";
import PropTypes from "prop-types";
import { socket } from "./socket.js";

function StartPage(props) {
    function handleSubmit(e) {
        e.preventDefault();
        props.setPage(props.pages.GAME);
        props.setMsg("Let's begin!");
        socket.emit("begin");
        socket.on("begin", (msg) => {
            props.setCountries(msg);
        });
    }

    function onChangePlayers(e) {
        props.setPlayers(parseInt(e.target.value));
    }

    function onChangeMode(e) {
        props.setMode(e.target.value);
    }

    return (
        <div id="StartPage">
            <br />
            In this game, you will create a chain of <br /> neighbouring
            countries.
            <form onSubmit={handleSubmit}>
                <br />
                Select the number of players:
                <div>
                    <label>
                        <input
                            type="radio"
                            id="numPlayers1"
                            value={1}
                            checked={props.players === 1}
                            onChange={onChangePlayers}
                        />
                        1
                    </label>
                    <label>
                        <input
                            type="radio"
                            id="numPlayers2"
                            value={2}
                            checked={props.players === 2}
                            onChange={onChangePlayers}
                        />
                        2
                    </label>
                    <label>
                        <input
                            type="radio"
                            id="numPlayers3"
                            value={3}
                            checked={props.players === 3}
                            onChange={onChangePlayers}
                        />
                        3
                    </label>
                    <label>
                        <input
                            type="radio"
                            id="numPlayers4"
                            value={4}
                            checked={props.players === 4}
                            onChange={onChangePlayers}
                        />
                        4
                    </label>
                </div>
                <br />
                Select the game mode:
                <div>
                    <label>
                        <input
                            type="radio"
                            id="mode1"
                            value="land"
                            checked={props.mode === "land"}
                            onChange={onChangeMode}
                        />
                        Land
                    </label>
                    <label>
                        <input
                            type="radio"
                            id="mode2"
                            value="maritime"
                            checked={props.mode === "maritime"}
                            onChange={onChangeMode}
                        />
                        Land and Maritime
                    </label>
                </div>
                <br />
                <button type="submit">Play now!</button>
            </form>
        </div>
    );
}

StartPage.propTypes = {
    setPage: PropTypes.func,
    pages: PropTypes.object,
    setMsg: PropTypes.func,
    players: PropTypes.number,
    setPlayers: PropTypes.func,
    mode: PropTypes.string,
    setMode: PropTypes.func,
};

export default StartPage;
