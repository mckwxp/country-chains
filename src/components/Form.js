import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { socket } from "./socket.js";

function Form(props) {
    const [name, setName] = useState("");

    // useEffect(() => {
    //     socket.emit("message", props.countries);
    // }, [props.countries]);

    // useEffect(() => {
    //     socket.on("reply", (msg) => props.setCountries(msg));
    //     return () => {
    //         socket.off("reply", (msg) => props.setCountries(msg));
    //     };
    // }, []);

    function handleSubmit(e) {
        e.preventDefault();
        const countryName = name.trim();
        if (countryName !== "") {
            let newCountry = props.addCountry(countryName);
            if (newCountry) {
                setName("");
                socket.emit("message", newCountry);
                socket.on("reply", (msg) => props.setCountries(msg));
            }
        }
    }

    function handleChange(e) {
        setName(e.target.value);
    }

    function handleClick() {
        props.setPage(props.pages.END);
        props.setMsg("Your score is:");
    }

    return (
        <div id="Form">
            <form onSubmit={handleSubmit} autoComplete="off">
                <p>Enter a country name:</p>
                <input
                    type="text"
                    autoComplete="off"
                    value={name}
                    onChange={handleChange}
                />
                <button type="submit">Chain it!</button>
            </form>
            <div>
                <button type="button" onClick={handleClick}>
                    Finish
                </button>
            </div>
        </div>
    );
}

Form.propTypes = {
    addCountry: PropTypes.func,
    countries: PropTypes.array,
    setPage: PropTypes.func,
    setMsg: PropTypes.func,
    pages: PropTypes.object,
};

export default Form;
