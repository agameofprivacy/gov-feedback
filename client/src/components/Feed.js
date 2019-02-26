import React, {Component} from "react";
import Composer from "./Composer";
import Post from "./Post";

class Feed extends Component {

    render() {

        const {selectedOrgName, posts, setFormState, selectedTopic, selectedIdentity, reset} = this.props;

        var postsArray = [];

        if (posts !== undefined && posts.length > 0) {
            posts.forEach(function(post, index){
                postsArray.push(
                    <Post key={index} post={post} />
                );
            })
            
        }

        return (
            <div className="feed">
                <Composer reset={reset} selectedTopic={selectedTopic} selectedIdentity={selectedIdentity} defaultTagName={selectedOrgName} setFormState={setFormState} />
                { posts !== undefined && posts.length > 0 &&
                    postsArray
                }
                { posts !== undefined && posts.length === 0 &&
                    <p>尚無回饋</p>
                }
            </div>
        )
    }
}

export default Feed;