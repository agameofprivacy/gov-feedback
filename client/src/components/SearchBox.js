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
        if (searchResults !== null && searchResults.data !== null){
            searchResults.data.organizations.forEach(function(result, key){
                items.push(<li key={key} value={key} onMouseDown={this.handleClick} className={"dropdown__item" + (dark ? " dropdown__item--dark" : "")}>{result.name}</li>)
            }.bind(this));

            if (searchResults.data.organizations.length === 0 && !this.state.isFetching) {
                items.push(<li key="a" value="a" className={"dropdown__item" + (dark ? " dropdown__item--dark" : "")}>查無結果</li>)
            } else if (this.state.isFetching){
                items.push(<li key="b" value="b" className={"dropdown__item" + (dark ? " dropdown__item--dark" : "")}>查詢中...</li>)
            }
        }
        

        var errors = [];

        if (searchResults !== null && searchResults.errors !== undefined && searchResults.errors !== null) {
            searchResults.errors.forEach(function(error, key){
                errors.push(<li key={key} value={key} className={"dropdown__item" + (dark ? " dropdown__item--dark" : "")}>{error.message}</li>)
            })
        };

        return (
            <div>
                <input onBlur={this.handleClick} className={dark ? "searchbox searchbox--dark" : "searchbox"} onChange={e => {this.setState({query: e.target.value, isFetching: true}); this.props.queryDB(e.target.value, (function(r){this.setState({isFetching: false})}).bind(this));}} value={query} placeholder="搜尋機關或議題" />
                { showsClose &&
                    <button onClick={dismissSearchbox} className="navbar__button navbar__button--secondary"><IconButton type="close" /></button>
                }
                {
                    searchResults !== null && searchResults.data !== null && query !== "" &&
                    <ul className={"dropdown raised" + (dark ? " dropdown--dark" : "")}>
                        {items}
                    </ul>
                }
                {
                    searchResults !== null && searchResults.errors !== undefined && searchResults.errors !== null &&
                    <ul className={"dropdown raised" + (dark ? " dropdown--dark" : "")}>
                        {errors}
                    </ul>
                }            
            </div>
        )
    }
}

export default SearchBox;