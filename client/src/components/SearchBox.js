import React, {Component} from 'react';
import IconButton from "../components/IconButton";

class SearchBox extends Component {

    state = {
        query: "",
    };

    handleClick = (e) => {
        if (e.target.type !== "text") {
            console.log('this is:', this.props.searchResults.data.organizations[e.target.value].name);
            this.props.setSelectedOrg(this.props.searchResults.data.organizations[e.target.value]);
        }
        if (this.props.dismissSearchbox) {
            this.props.dismissSearchbox();
        }
    }

    render() {
        const {query} = this.state;
        const {searchResults, dark, showsClose, dismissSearchbox} = this.props;

        var items = [];
        if (searchResults){
            searchResults.data.organizations.forEach(function(result, key){
                items.push(<li key={key} value={key} onMouseDown={this.handleClick} className={"dropdown__item" + (dark ? " dropdown__item--dark" : "")}>{result.name}</li>)
            }.bind(this));
        }
        return (
            <div>
                <input onBlur={this.handleClick} className={dark ? "searchbox searchbox--dark" : "searchbox"} onChange={e => {this.setState({query: e.target.value}); this.props.queryDB(e.target.value);}} value={query} placeholder="搜尋機關或議題" />
                { showsClose &&
                    <button onClick={dismissSearchbox} className="navbar__button navbar__button--secondary"><IconButton type="close" /></button>
                }
                {
                    searchResults !== null && typeof searchResults !== "undefined" && searchResults.hasOwnProperty("data") && searchResults.data.organizations.length > 0 && query !== "" &&
                    <ul className={"dropdown raised" + (dark ? " dropdown--dark" : "")}>
                        {items}
                    </ul>
                }            
            </div>
        )
    }
}

export default SearchBox;