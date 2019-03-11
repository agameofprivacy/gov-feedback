import React, { Component } from "react";
import AgencyPrompt from "./AgencyPrompt";
import SearchBox from "./SearchBox";
import Footer from "./Footer";

import logo from "../assets/images/logo--transparent.png";

class Landing extends Component {
  // initialize our state
  state = {
    query: ""
  };

  render() {
    const { query } = this.state;
    const {
      randomOrgs,
      randomIndex,
      orgResults,
      topicResults,
      setSelectedOrg,
      setSelectedTopic
    } = this.props;
    return (
      <div>
        <div className="landing">
          <img
            className="landing__logo"
            src={logo}
            alt="政府機關回饋平台 logo"
          />
          <AgencyPrompt randomOrgs={randomOrgs} randomIndex={randomIndex} />
          <SearchBox
            showsAccount={false}
            setSelectedOrg={setSelectedOrg}
            setSelectedTopic={setSelectedTopic}
            query={query}
            queryOrgs={this.props.queryOrgs}
            queryTopics={this.props.queryTopics}
            orgResults={orgResults}
            topicResults={topicResults}
          />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Landing;
