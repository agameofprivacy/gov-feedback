import React, {Component} from 'react';

class SearchBox extends Component {

    state = {
        query: "",
    };

    handleClick = (e) => {
        console.log('this is:', this.props.searchResults.data.organizations[e.target.value].name);
    }

    render() {
        const {query} = this.state;
        const {searchResults} = this.props;

        var items = [];
        if (searchResults){
            searchResults.data.organizations.forEach(function(result, key){
                items.push(<li key={key} value={key} onClick={this.handleClick} className="dropdown__item">{result.name}</li>)
            }.bind(this));
        }
        return (
            <div>
                <input className="searchbox" onChange={e => {this.setState({query: e.target.value}); this.props.queryDB(e.target.value);}} value={query} placeholder="搜尋機關或議題" />
                {
                    searchResults !== null && searchResults.data.organizations.length > 0 && query !== "" &&
                    <ul className="dropdown raised">
                        {items}
                    </ul>
                }            
            </div>
        )
    }
}

export default SearchBox;