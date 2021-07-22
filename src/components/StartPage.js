import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { socket } from "./socket.js";

function StartPage(props) {
    function handleSubmit(e) {
        e.preventDefault();

        if (!props.room) {
            alert(
                "Please choose a room (or create one and join if there are no rooms)"
            );
        } else if (!props.username.trim()) {
            alert("Please enter your player name");
        } else {
            socket.emit("configureRoom", {
                players: props.players,
                mode: props.mode,
                roomID: props.room,
                username: props.username,
            });
            props.setPage("GAME");
            props.setMsg("Let's begin!");
        }
    }

    function onChangePlayers(e) {
        props.setPlayers(parseInt(e.target.value));
    }

    function onChangeMode(e) {
        props.setMode(e.target.value);
    }

    function onChangeRoom(e) {
        props.setRoom(parseInt(e.target.value));
    }

    function onchangeUsername(e) {
        props.setUsername(e.target.value);
    }

    useEffect(() => {
        let r = props.rooms.filter((r) => r.id === props.room)[0];
        if (r) {
            if (r.mode && r.players) {
                props.setMode(r.mode);
                props.setPlayers(r.players);
            }
        }
    }, [props]);

    return (
        <div id="StartPage">
            <br />
            In this game, you will create a chain of <br /> neighbouring
            countries.
            <form onSubmit={handleSubmit}>
                <br />
                Select the number of players:
                <div>
                    {[1, 2, 3, 4].map((x) => {
                        return (
                            <label key={"numPlayers" + x}>
                                <input
                                    type="radio"
                                    value={x}
                                    checked={props.players === x}
                                    onChange={onChangePlayers}
                                />
                                {x}
                            </label>
                        );
                    })}
                </div>
                <br />
                Select the game mode:
                <div>
                    {[
                        { mode: "land", label: "Land" },
                        { mode: "maritime", label: "Land and maritime" },
                    ].map((x) => {
                        return (
                            <label key={"mode" + x}>
                                <input
                                    type="radio"
                                    value={x.mode}
                                    checked={props.mode === x.mode}
                                    onChange={onChangeMode}
                                />
                                {x.label}
                            </label>
                        );
                    })}
                </div>
                <br />
                <div>
                    Select a room:
                    <div>
                        {props.rooms.length > 0 ? (
                            props.rooms.map((r) => {
                                return (
                                    <label key={"room" + r.id}>
                                        <input
                                            type="radio"
                                            value={r.id}
                                            checked={props.room === r.id}
                                            onChange={onChangeRoom}
                                        />
                                        {"Room " + r.id}
                                    </label>
                                );
                            })
                        ) : (
                            <div>There are no rooms available</div>
                        )}
                    </div>
                </div>
                <br />
                <div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            socket.emit("createroom", {
                                players: props.players,
                                mode: props.mode,
                            });
                        }}
                    >
                        Create a new room
                    </button>
                </div>
                <br />
                Enter your player name:
                <br />
                <input
                    type="text"
                    value={props.username}
                    onChange={onchangeUsername}
                />
                <button type="submit">Play now!</button>
            </form>
        </div>
    );
}

StartPage.propTypes = {
    setPage: PropTypes.func,
    setMsg: PropTypes.func,
    players: PropTypes.number,
    setPlayers: PropTypes.func,
    mode: PropTypes.string,
    setMode: PropTypes.func,
    rooms: PropTypes.array,
    room: PropTypes.number,
    setRoom: PropTypes.func,
    username: PropTypes.string,
    setUserName: PropTypes.func,
};

export default StartPage;
