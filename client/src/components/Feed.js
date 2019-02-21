import React, {Component} from "react";
import Composer from "./Composer";
import Post from "./Post";

class Feed extends Component {

    render() {

        const {selectedOrgName, posts, setFormState, selectedTag, selectedIdentity} = this.props;

        var postsArray = [];

        posts.forEach(function(post, index){
            postsArray.push(
                <Post key={index} post={post} />
            );
        })

        return (
            <div className="feed">
                <Composer selectedTag={selectedTag} selectedIdentity={selectedIdentity} defaultTagName={selectedOrgName} setFormState={setFormState} />
                {postsArray}
            </div>
        )
    }
}

export default Feed;