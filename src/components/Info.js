import React from "react";

function Info(props) {
    return (
        <div className="Info">
            <div>{props.msg}</div>
            <div>
                <div className="Info1">Countries: {props.score[0]}</div>
                <div className="Info2">Unique: {props.score[1]}</div>
            </div>
        </div>
    );
}

export default Info;
