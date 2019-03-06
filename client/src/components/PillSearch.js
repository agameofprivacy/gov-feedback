import React, {Component} from "react";
import Pills from "./Pills";

class PillSearch extends Component {

    state = {
        topics: [],
        orgs: [],
        orgIds: [],
        selected: [],
        selectMultiple: false,
        query: "",
    }

    componentDidMount = () => {
        switch (this.props.type) {
            case "org":
                var defaultTopics = [];
                var topicsWeek = this.props.selectedOrg.topicsWeek.sort((a, b) => {
                    return a.count - b.count;
                })
                topicsWeek.forEach((topic) => {
                    defaultTopics.push(topic.name);
                })
                this.setState({topics: defaultTopics})
                break;
            case "topic":
                var defaultOrgs = [];
                var defaultOrgIds = [];
                console.log("selectedTopic", this.props.selectedTopic);
                var orgsWeek = this.props.selectedTopic.orgsWeek.sort((a, b) => {
                    return a.count - b.count;
                })
                orgsWeek.forEach((org) => {
                    defaultOrgs.push(org.name);
                    defaultOrgIds.push(org.identifier);
                })
                console.log("orgIds", defaultOrgIds);
                this.setState({orgs: defaultOrgs, orgIds: defaultOrgIds})
                break;
            default:
                break;
        }
    }

    handleChange = (e) => {
        this.setState({query: e.target.value});
        switch (this.props.type) {
            case "topic":
                this.searchForOrg(e.target.value);
                break;
            case "org":
                this.searchForTopic(e.target.value);
                break;
            default:
                break;
        }
    }


    searchForDefault = () => {
        switch (this.props.type){
            case "topic":
                break;
            case "org":
                break;
            default:
                break;
        }
    }

    searchForTopic = (name) => {
        console.log(name);
        this.setState({topics: []});
        fetch('/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': "application/json",
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              query: `query topics($name: String) {
                topics(name: $name){
                  name
                }
              }`,
              variables: { name },
            })
          })
          .then(r => r.json())
          .then(result => {
            var topicStrings = [];
            result.data.topics.forEach((topic) => {
                topicStrings.push(topic.name);
            });
            if (!topicStrings.includes(name) && name !== "") {
                topicStrings.push(name);
            }
            if (name === this.state.query) {
            this.setState({topics: topicStrings})
                console.log("topics", this.state.topics);
            }
        });
    }

    searchForOrg = (name) => {
        console.log(name);
        this.setState({orgs: []});
        fetch('/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': "application/json",
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              query: `query organizations($name: String) {
                organizations(name: $name){
                  name
                  identifiers {
                      scheme
                      identifier
                  }
                }
              }`,
              variables: { name },
            })
          })
          .then(r => r.json())
          .then(result => {
            var orgStrings = [];
            console.log("result", result);
            result.data.organizations.forEach((org) => {
                orgStrings.push(org.name);
            });
            if (name === this.state.query) {
            this.setState({orgs: orgStrings})
                console.log("orgs", this.state.orgs);
            }
        });
    }

    handlePillClick = (value, label) => {
        var targetSelected = this.state.selected;
        if (this.state.selectMultiple) {
            if (targetSelected.includes(label)) {
                targetSelected.splice(targetSelected.indexOf(label), 1);
            } else {
                targetSelected.push(label)
            }
        } else {
            targetSelected = [label];
        }
        this.setState({selected: targetSelected})
        this.props.submitForm(value, label);
    }

    render() {
        // const {type} = this.props;

        return (
            <div className="pill-search">
                <input onChange={this.handleChange} placeholder="搜尋" className="pill-search__searchbox" />
                <Pills highlighted={this.state.selected} handlePillClick={this.handlePillClick} values={this.props.type === "org" ? this.state.topics : this.state.orgIds } pills={this.props.type === "org" ? this.state.topics: this.state.orgs} />
            </div>
        );
    }
}

export default PillSearch;