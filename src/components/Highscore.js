import React from "react";
import PropTypes from "prop-types";

function Highscore(props) {
    function viewGame(x) {
        return () => {
            props.setMode(x.mode);
            props.setCountries(x.countries);
            props.setPlayersInRoom(x.playersInRoom);
            props.setPage("REPLAY");
            props.setMsg("You are reviewing a game.");
        };
    }

    function returnToHome() {
        props.setPage("START");
        props.setMsg("Welcome to the game!");
    }

    function HighscoreItem(x, i) {
        return (
            <tr key={`highscore${i}`}>
                <td>{x.mode}</td>
                <td>{x.playersInRoom.map((p) => p.username).join(", ")}</td>
                <td>{x.score}</td>
                <td>
                    <button
                        type="button"
                        className="link-button"
                        onClick={viewGame(x)}
                    >
                        View the game
                    </button>
                </td>
            </tr>
        );
    }
    return (
        <div id="Highscore">
            <h1>Highscore</h1>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Mode</th>
                        <th scope="col">Players</th>
                        <th scope="col">
                            Score
                            <br />
                            (unique countries)
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {props.highscore
                        ? props.highscore.map(HighscoreItem)
                        : null}
                </tbody>
            </table>
            <br />
            <br />
            <button type="button" onClick={returnToHome}>
                Back to homepage
            </button>
        </div>
    );
}

Highscore.propTypes = {
    highscore: PropTypes.array,
    countries: PropTypes.array,
    playersInRoom: PropTypes.array,
    setMode: PropTypes.func,
    setCountries: PropTypes.func,
    setPlayersInRoom: PropTypes.func,
    setPage: PropTypes.func,
    setMsg: PropTypes.func,
};

export default Highscore;
