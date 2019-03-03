import React, {Component} from "react";
import Pills from "./Pills";

class PillSearch extends Component {

    state = {
        topics: [],
        selected: [],
        selectMultiple: false,
        query: "",
    }

    componentDidMount = () => {
        if (this.props.type === "topics") {
            var defaultTopics = [];
            var topicsWeek = this.props.selectedOrg.topicsWeek.sort((a, b) => {
                return a.count - b.count;
            })
            topicsWeek.forEach((topic) => {
                defaultTopics.push(topic.name);
            })
            this.setState({topics: defaultTopics})
        }
    }

    handleChange = (e) => {
        this.setState({query: e.target.value});
        this.searchForTopic(e.target.value);
    }

    searchForDefault = () => {
        switch (this.props.type){
            case "topics":
                break;
            case "orgs":
                break;
            default:
                break;
        }
    }

    searchForTopic = (name) => {
        console.log(name);
        this.setState({topics: []});
        fetch('http://localhost:3001/graphql', {
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

    handlePillClick = (pill) => {
        console.log("pill clicked", pill);
        var targetSelected = this.state.selected;
        if (this.state.selectMultiple) {
            if (targetSelected.includes(pill)) {
                targetSelected.splice(targetSelected.indexOf(pill), 1);
            } else {
                targetSelected.push(pill)
            }
        } else {
            targetSelected = [pill];
        }
        
        this.setState({selected: targetSelected})
        this.props.submitForm(pill);
    }

    render() {
        // const {type} = this.props;

        return (
            <div className="pill-search">
                <input onChange={this.handleChange} placeholder="搜尋" className="pill-search__searchbox" />
                <Pills highlighted={this.state.selected} handlePillClick={this.handlePillClick}  pills={this.state.topics} />
            </div>
        );
    }
}

export default PillSearch;