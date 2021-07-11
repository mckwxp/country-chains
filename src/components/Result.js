import React from "react";
import { nanoid } from "nanoid";

function Result(props) {
    // converts the country list to a list
    // reverse the list so that most recent one is on top
    const countries = props.countries
        .map((c, i) => {
            return <li key={"id-" + nanoid()}>{c}</li>;
        })
        .slice(0)
        .reverse();

    return (
        <div className="Result">
            <ul>{countries}</ul>
        </div>
    );
}

export default Result;
