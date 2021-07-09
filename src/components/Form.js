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
        <div className="Form">
            <form onSubmit={handleSubmit} autoComplete="off">
                <p className="label-wrapper">
                    <label htmlFor="country-input" className="label">
                        Enter a country name:
                    </label>
                </p>
                <input
                    type="text"
                    id="country-input"
                    className="input"
                    name="text"
                    autoComplete="off"
                    value={name}
                    onChange={handleChange}
                />
                <button type="submit" className="btn">
                    Chain it!
                </button>
            </form>
            <div>
                <button type="button" className="btn" onClick={handleClick}>
                    Finish
                </button>
            </div>
        </div>
    );
}

export default Form;
