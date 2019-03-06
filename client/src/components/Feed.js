import React, {Component} from "react";
import Composer from "./Composer";
import Post from "./Post";
import EmptyState from "./EmptyState";
const randomColor = require('randomcolor');

class Feed extends Component {
    
    colors = randomColor({
        luminosity: 'bright',
        format: 'hex',
        count: 100,
    })

    handleOrgClick = (identifier) => {
        console.log(identifier[0], identifier[1]);
        this.props.setSelectedOrg({
            name: identifier[1],
            identifiers: [
                {
                    identifier: identifier[0]
                }
            ]
        })
    }

    handleTopicClick = (name) => {
        this.props.setSelectedTopic(name);
    }



    render() {

        const {selectedType, selectedOrgName, posts, setFormState, selectedTopicName, selectedIdentity, reset, composerTag} = this.props;

        var postsArray = [];

        if (posts !== undefined && posts.length > 0) {
            var topics = [];
            var orgs = [];
            posts.forEach((post) => {
                if (!topics.includes(post.topic)){
                    topics.push(post.topic);
                }
                if (!orgs.includes(post.organization)){
                    orgs.push(post.organization);
                }
            }) 
            posts.forEach(function(post, index){
                postsArray.push(
                    <Post handleTopicClick={this.handleTopicClick} handleOrgClick={this.handleOrgClick} tagType={selectedType === "org" ? "topic" : "org"} color={selectedType === "org" ? this.colors[topics.indexOf(post.topic)] : this.colors[orgs.indexOf(post.organization)]} key={index} post={post} />
                );
            }.bind(this));
            
        }

        return (
            <div className="feed">
                <Composer reset={reset} composerTag={composerTag} selectedTopicName={selectedTopicName} selectedIdentity={selectedIdentity} defaultTagName={selectedType === "org" ? selectedOrgName : selectedTopicName} setFormState={setFormState} selectedType={selectedType} />
                { posts !== undefined && posts.length > 0 &&
                    postsArray
                }
                { posts !== undefined && posts.length === 0 &&
                    <EmptyState title={"尚無回饋"} />
                }
            </div>
        )
    }
}

export default Feed;