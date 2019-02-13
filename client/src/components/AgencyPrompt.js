import React, { Component } from "react";

class AgencyPrompt extends Component {

    render() {
        const { randomOrgs, randomIndex } = this.props;

        return (
            <p className="text text--lightest text--hero">
            想對<span className="block m-b-025 m-t-025 text--bold">{randomOrgs[randomIndex].name}</span>說什麼？</p>
        );
    }
}

export default AgencyPrompt;