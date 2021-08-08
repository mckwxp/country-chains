import React from "react";
import PropTypes from "prop-types";

function Highscore(props) {
    function viewGame(x) {
        return () => {
            props.setMode(x.mode);
            props.setCountries(x.countries);
            props.setPlayersInRoom(x.playersInRoom);
            props.setPage("REPLAY");
        };
    }

    function HighscoreItem(x, i) {
        return (
            <tr key={`highscore${i}`}>
                <td>{x.mode}</td>
                <td>{x.playersInRoom.map((p) => p.username).join(", ")}</td>
                <td>{x.countries.length}</td>
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
                <tr>
                    <th scope="col">Mode</th>
                    <th scope="col">Players</th>
                    <th scope="col">
                        Score
                        <br />
                        (unique countries)
                    </th>
                </tr>
                {props.highscore ? props.highscore.map(HighscoreItem) : null}
            </table>
            <br />
            <br />
            <button type="button" onClick={() => props.setPage("START")}>
                Go back to the homepage{" "}
            </button>
        </div>
    );
}

Highscore.propTypes = {
    highscore: PropTypes.array,
    countries: PropTypes.array,
    playersInRoom: PropTypes.array,
};

export default Highscore;
