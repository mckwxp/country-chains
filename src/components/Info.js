import React from "react";

function Info(props) {
    return (
        <div id="Info">
            <div>{props.msg}</div>
            <div>
                <div className="score">Countries: {props.score[0]}</div>
                <div className="score">Unique: {props.score[1]}</div>
            </div>
        </div>
    );
}

export default Info;
