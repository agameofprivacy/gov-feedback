import React, { Component } from "react";

class AgencyPrompt extends Component {

    state = {
        agency: "行政執行署臺北分署",
    }

    render() {
        const { agency } = this.state;
        return (
            <p className="text text--lightest text--hero">
            想對<span className="block m-b-025 m-t-025 text--bold">{agency}</span>說什麼？</p>
        );
    }
}

export default AgencyPrompt;