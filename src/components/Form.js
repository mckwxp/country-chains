import React, { useState } from "react";

function Form(props) {
    const [name, setName] = useState("");
    const [countries, setCountries] = useState([]);

    function handleSubmit(e) {
        e.preventDefault();
        const countryName = name.trim();
        if (countryName !== "") {
            if (!props.checkCountryFunc(countryName)) {
                alert(`${countryName} is not a valid country`);
            } else {
                if (countries.length > 0) {
                    if (
                        props.checkNeighboursFunc(
                            countries[countries.length - 1],
                            countryName
                        )
                    ) {
                        setCountries([...countries, countryName]);
                        setName("");
                    } else {
                        alert(
                            `${countryName} is not a neighbour of ${
                                countries[countries.length - 1]
                            }`
                        );
                    }
                } else {
                    setCountries([...countries, countryName]);
                    setName("");
                }
            }
        }
    }

    function handleChange(e) {
        setName(e.target.value);
    }

    return (
        <form onSubmit={handleSubmit} autoComplete="off">
            <h2 className="label-wrapper">
                <label htmlFor="country-input" className="label">
                    Enter a country name:
                </label>
            </h2>
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
    );
}

export default Form;
