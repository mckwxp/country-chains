import React from "react";
import PropTypes from "prop-types";

function Highscore(props) {
    return <div>{JSON.stringify(props.highscore)}</div>;
}

Highscore.propTypes = { highscore: PropTypes.object };

export default Highscore;
