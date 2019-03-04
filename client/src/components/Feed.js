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

    render() {

        const {selectedOrgName, posts, setFormState, selectedTopicName, selectedIdentity, reset} = this.props;

        var postsArray = [];

        if (posts !== undefined && posts.length > 0) {
            var topics = [];
            posts.forEach((post) => {
                if (!topics.includes(post.topic)){
                    topics.push(post.topic);
                }
            })
            posts.forEach(function(post, index){
                postsArray.push(
                    <Post color={this.colors[topics.indexOf(post.topic)]} key={index} post={post} />
                );
            }.bind(this));
            
        }

        return (
            <div className="feed">
                <Composer reset={reset} selectedTopicName={selectedTopicName} selectedIdentity={selectedIdentity} defaultTagName={selectedOrgName} setFormState={setFormState} />
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