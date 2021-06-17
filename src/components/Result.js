import React, { useState } from "react";
import { nanoid } from "nanoid";

function Result(props) {
    const countries = props.countries
        .slice(0)
        .reverse()
        .map((c) => {
            return <li key={"id-" + nanoid()}>{c}</li>;
        });

    return (
        <div className="Result">
            <ul>{countries}</ul>
        </div>
    );
}

export default Result;
