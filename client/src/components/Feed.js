import React, {Component} from "react";
import Composer from "./Composer";
import Post from "./Post";

class Feed extends Component {

    render() {

        const {selectedOrgName, posts, setFormState, selectedTopic, selectedIdentity, reset} = this.props;

        var postsArray = [];

        posts.forEach(function(post, index){
            postsArray.push(
                <Post key={index} post={post} />
            );
        })

        return (
            <div className="feed">
                <Composer reset={reset} selectedTopic={selectedTopic} selectedIdentity={selectedIdentity} defaultTagName={selectedOrgName} setFormState={setFormState} />
                {postsArray}
            </div>
        )
    }
}

export default Feed;