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
                mode: props.mode,
                roomID: props.room,
                username: props.username,
            });
            props.setPage("GAME");
            props.setMsg("Let's begin!");
        }
    }

    function createRoom(e) {
        e.preventDefault();
        socket.emit("createRoom", {
            mode: props.mode,
        });
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

    // Set room mode when entering an existing room
    useEffect(() => {
        const r = props.rooms.filter((r) => r.id === props.room)[0];
        if (r) {
            if (r.mode) {
                props.setMode(r.mode);
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
                Select the game mode:
                <div>
                    {["Land", "Land and maritime"].map((x) => (
                        <label key={"mode" + x}>
                            <input
                                type="radio"
                                value={x}
                                checked={props.mode === x}
                                onChange={onChangeMode}
                            />
                            {x}
                        </label>
                    ))}
                </div>
                <br />
                <div>
                    Select a room:
                    <div id="roomList">
                        {props.rooms.length > 0 ? (
                            props.rooms.map((r) => (
                                <div>
                                    <label key={"room" + r.id}>
                                        <input
                                            type="radio"
                                            value={r.id}
                                            checked={props.room === r.id}
                                            onChange={onChangeRoom}
                                        />
                                        {`Room ${r.id} (${
                                            r.mode
                                                ? "Mode: " + r.mode + ";  "
                                                : ""
                                        }Online players: ${
                                            r.playersInRoom.length === 0
                                                ? "none"
                                                : r.playersInRoom
                                                      .map((p) => p.username)
                                                      .join(", ")
                                        })`}
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            socket.emit("spectate", {
                                                roomID: r.id,
                                            });
                                            props.setPage("GAME");
                                            props.setSpectate(true);
                                            props.setRoom(r.id);
                                            props.setMode(r.mode);
                                        }}
                                    >
                                        Spectate
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div>There are no rooms available</div>
                        )}
                    </div>
                </div>
                <br />
                <div>
                    <button type="button" onClick={createRoom}>
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
    mode: PropTypes.string,
    setMode: PropTypes.func,
    rooms: PropTypes.array,
    room: PropTypes.number,
    setRoom: PropTypes.func,
    username: PropTypes.string,
    setUserName: PropTypes.func,
    setSpectate: PropTypes.func,
};

export default StartPage;
