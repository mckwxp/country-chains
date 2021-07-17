import React, { useState } from "react";
import PropTypes from "prop-types";
import { socket } from "./socket.js";

function Form(props) {
    const [name, setName] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        const countryName = name.trim();
        if (countryName !== "") {
            let newCountry = props.addCountry(countryName);
            if (newCountry) {
                setName("");
                socket.emit("message", newCountry);
            }
        }
    }

    function handleChange(e) {
        setName(e.target.value);
    }

    function handleClick() {
        props.setPage(props.pages.END);
        props.setMsg("Your score is:");
        socket.emit("end");
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
