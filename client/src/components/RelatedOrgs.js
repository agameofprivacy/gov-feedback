import React, {Component} from "react";

class RelatedOrgs extends Component {
    
    render() {
        const {collections} = this.props;

        var collectionsArray = [];

        collections.forEach(function(collection, index){
            var entries = []
            collection.entries.forEach(function(entry, index){
                entries.push(<span key={index} className={"pill section__collections-container__entry" + (collection.label === "上級機關" ? " pill--primary" : " pill--secondary")}>{entry.name}</span>)
            })
            
            collectionsArray.push(
                <div key={index} className="section__collections-container__collection">
                    <h3 className="section__collections-container__title">{collection.label}</h3>
                    <div className="section__collections-container__entries-container">
                        {entries}
                    </div>
                </div>
            )
        })

        return (
            <div className="section">
                <div className="section__collections-container">
                    {collectionsArray}
                </div>
            </div>
        )
    }
}

export default RelatedOrgs;