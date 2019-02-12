import React, { Component } from "react";
import AgencyPrompt from "./AgencyPrompt";
import SearchBox from './SearchBox';

import logo from '../assets/images/logo--transparent.png';

class Landing extends Component {
    // initialize our state 
    state = {
        query: "",
    };
    render() {
        const { query } = this.state;
        return (
            <div className="landing">
                <img className="landing__logo" src={logo} alt="政府機關回饋平台 logo" />
                <AgencyPrompt />
                <SearchBox query={query} queryDB={this.props.queryDB} />
            </div>
        );
    }
}

export default Landing;