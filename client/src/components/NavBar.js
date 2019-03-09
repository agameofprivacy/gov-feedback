import React, { Component } from "react";
import SearchBox from "./SearchBox";
import logo from "../assets/images/logo--mini.png";
import IconButton from "../components/IconButton";

class NavBar extends Component {
  state = {
    showsSearchBox: false,
    query: ""
  };

  toggleSearchBox = () => {
    console.log("toggle search box");
    this.setState({ showsSearchBox: !this.state.showsSearchBox }, function() {
      if (this.state.showsSearchBox) {
        document.querySelector(".navbar input").focus();
        document.querySelector(".navbar input").select();
      }
    });
  };

  dismissSearchbox = () => {
    this.setState({ showsSearchBox: false });
  };

  clickHome = () => {
    window.location.reload();
  };

  render() {
    const {
      dark,
      title,
      setSelectedOrg,
      setSelectedTopic,
      queryOrgs,
      queryTopics,
      orgResults,
      topicResults
    } = this.props;
    const { showsSearchBox, query } = this.state;
    if (showsSearchBox) {
      return (
        <div className="navbar">
          <SearchBox
            showsClose
            dismissSearchbox={this.dismissSearchbox}
            setSelectedOrg={setSelectedOrg}
            setSelectedTopic={setSelectedTopic}
            query={query}
            queryOrgs={queryOrgs}
            queryTopics={queryTopics}
            orgResults={orgResults}
            topicResults={topicResults}
            dark={dark}
          />
        </div>
      );
    } else {
      return (
        <div className="navbar">
          <img
            className="navbar__logo"
            src={logo}
            alt="政府機關回饋平台 logo"
            onClick={this.clickHome}
          />
          <h1 onClick={this.toggleSearchBox} className="navbar__title">
            {title}
          </h1>
          <button onClick={this.toggleSearchBox} className="navbar__button">
            <IconButton type="search" />
          </button>
        </div>
      );
    }
  }
}

export default NavBar;
