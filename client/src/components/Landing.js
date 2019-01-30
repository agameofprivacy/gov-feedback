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
            <div class="landing">
                <img class="landing__logo" src={logo} />
                <AgencyPrompt />
                <SearchBox />
            </div>
        );
    }
}

export default Landing;