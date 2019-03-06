import React, {Component} from 'react';
import IconButton from "../components/IconButton";

class SearchBox extends Component {

    state = {
        query: "",
        isFetchingOrgs: false,
        isFetchingTopics: false
    };

    handleClick = (e) => {
        console.log(e.target);
        if (e.target.type !== "text") {
            if (e.target.type === "org") {
                this.props.setSelectedOrg(this.props.orgResults.data.organizations[e.target.value]);
            } else if (e.target.type === "topic") {
                console.log("set topic")
                this.props.setSelectedTopic(this.props.topicResults.data.topics[e.target.value].name);
            }
        }
        if (this.props.dismissSearchbox) {
            this.props.dismissSearchbox();
        }
    }

    render() {
        const {query} = this.state;
        const {orgResults, topicResults, dark, showsClose, dismissSearchbox} = this.props;

        var orgItems = [];
        var topicItems = [];

        if (orgResults !== null && orgResults.data !== null){
            orgResults.data.organizations.forEach(function(result, key){
                orgItems.push(<li key={key} value={key} type="org" onMouseDown={this.handleClick} className={"dropdown__item" + (dark ? " dropdown__item--dark" : "")}>{result.name}</li>)
            }.bind(this));

            if (orgResults.data.organizations.length === 0 && !this.state.isFetchingOrgs) {
                orgItems.push(<li key="a" value="a" type="text" className={"dropdown__item" + (dark ? " dropdown__item--dark" : "")}>查無結果</li>)
            } else if (this.state.isFetchingOrgs){
                orgItems.push(<li key="b" value="b" type="text" className={"dropdown__item" + (dark ? " dropdown__item--dark" : "")}>查詢中...</li>)
            }
        }

        if (topicResults !== null && topicResults.data !== null){
            topicResults.data.topics.forEach(function(result, key){
                topicItems.push(<li key={key} value={key} type="topic" onMouseDown={this.handleClick} className={"dropdown__item" + (dark ? " dropdown__item--dark" : "")}>{result.name}</li>)
            }.bind(this));

            if (topicResults.data.topics.length === 0 && !this.state.isFetchingTopics) {
                topicItems.push(<li key="a" value="a" type="text" className={"dropdown__item" + (dark ? " dropdown__item--dark" : "")}>查無結果</li>)
            } else if (this.state.isFetchingTopics){
                topicItems.push(<li key="b" value="b" type="text" className={"dropdown__item" + (dark ? " dropdown__item--dark" : "")}>查詢中...</li>)
            }
        }


        var errors = [];

        if (orgResults !== null && orgResults.errors !== undefined && orgResults.errors !== null) {
            orgResults.errors.forEach(function(error, key){
                errors.push(<li key={key} value={key} className={"dropdown__item" + (dark ? " dropdown__item--dark" : "")}>{error.message}</li>)
            })
        };

        if (topicResults !== null && topicResults.errors !== undefined && topicResults.errors !== null) {
            topicResults.errors.forEach(function(error, key){
                errors.push(<li key={key} value={key} className={"dropdown__item" + (dark ? " dropdown__item--dark" : "")}>{error.message}</li>)
            })
        };


        return (
            <div>
                <input 
                    onBlur={this.handleClick} 
                    className={dark ? "searchbox searchbox--dark" : "searchbox"} 
                    onChange={ e => {
                            this.setState({query: e.target.value, isFetchingOrgs: true, isFetchingTopics: true}); 
                            this.props.queryOrgs(e.target.value, (function(r){this.setState({isFetchingOrgs: false})}).bind(this));
                            this.props.queryTopics(e.target.value, (function(r){this.setState({isFetchingTopics: false})}).bind(this));
                        }
                    } 
                    value={query} 
                    placeholder="搜尋機關或議題名稱" 
                />
                { showsClose &&
                    <button onClick={dismissSearchbox} className="navbar__button navbar__button--secondary"><IconButton type="close" /></button>
                }
                {
                    orgResults !== null && orgResults.data !== null && topicResults !== null && topicResults.data !== null && query !== "" &&
                    <ul className={"dropdown raised" + (dark ? " dropdown--dark" : "")}>
                        <li className="dropdown__section">
                            <h4 className="dropdown__section__title">政府機關</h4>
                            <ul className="dropdown__list">
                                {orgItems}
                            </ul>
                        </li>
                        <li className="dropdown__section">
                            <h4 className="dropdown__section__title">議題</h4>
                            <ul className="dropdown__list">
                                {topicItems}
                            </ul>
                        </li>
                    </ul>
                }
                {
                    orgResults !== null && orgResults.errors !== undefined && orgResults.errors !== null &&
                    <ul className={"dropdown raised" + (dark ? " dropdown--dark" : "")}>
                        {errors}
                    </ul>
                }          
            </div>
        )
    }
}

export default SearchBox;