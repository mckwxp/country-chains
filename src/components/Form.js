import React, { useState } from "react";
import PropTypes from "prop-types";

function Form(props) {
    const [name, setName] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        const countryName = name.trim();
        if (countryName !== "") {
            if (props.addCountry(countryName)) {
                setName("");
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
    setPage: PropTypes.func,
    setMsg: PropTypes.func,
    pages: PropTypes.object,
};

export default Form;
