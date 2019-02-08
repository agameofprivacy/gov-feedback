import React, {Component} from 'react';

class SearchBox extends Component {

    state = {
        query: "",
    };

    render() {
        const {query} = this.state;

        return (
            <input className="searchbox" onChange={e => this.setState({query: e.target.value})} value={query} placeholder="搜尋機關或議題" />
        )
    }
}

export default SearchBox;