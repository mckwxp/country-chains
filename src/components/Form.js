import React, { useState } from "react";

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

export default Form;
