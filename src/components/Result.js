import React, { useState } from "react";
import { nanoid } from "nanoid";

function Result(props) {
    console.log(props.countries);
    console.log(props.countries.reverse());
    const countries = props.countries
        .slice(0)
        .reverse()
        .map((c) => {
            return <li key={"id-" + nanoid()}>{c}</li>;
        });
    console.log(countries);
    return <ul>{countries}</ul>;
}

export default Result;
