import React, {Component} from "react";
import Composer from "./Composer";
import Post from "./Post";

class Feed extends Component {
    render() {

        const {posts} = this.props;

        var postsArray = [];

        posts.forEach(function(post, index){
            postsArray.push(
                <Post key={index} post={post} />
            );
        })

        return (
            <div className="feed">
                <Composer />
                {postsArray}
            </div>
        )
    }
}

export default Feed;