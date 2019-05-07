import React, {Component} from "react";
import Feed from "./Feed";

var remote = "https://gov-feedback.appspot.com";
var local= "http://localhost:3001";

const host = local;

class PostsFromUser extends Component {

    state = {
        posts: [],
        hasAdditionalPosts: true,
    }

    componentDidMount = () => {
        var dateVal = this.state.posts !== undefined && (this.state.posts.length > 0 && this.state.hasAdditionalPosts) ? this.state.posts[this.state.posts.length - 1].created : Number(new Date());
        this.fetchPostsByUser(this.props.username, dateVal, false);
    }

    fetchPostsByUser = (user, date, append) => {
        fetch(`${host}/graphql`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({
              query: `query postsByUser($user: String, $date: Float){
                postsByUser(user: $user, date: $date){
                  author,
                  authorProfile {
                    avatarUrl
                  },
                  topic,
                  organization,
                  organization_id,
                  created,
                  content,
                  likes {
                    user,
                  },
                  replies{
                    content,
                    author,
                    _id,
                    created
                  },
                  isForwardedPostOf {
                    content,
                    author,
                    organization,
                    organization_id,
                    topic,
                    created,
                    authorProfile {
                      avatarUrl
                    },
                    replies{
                      content,
                      author,
                      _id,
                      created
                    },
                    likes{
                      user
                    }
                    _id 
                  },
                  _id
                }
              }`,
              variables: { user, date }
            })
          })
            .then(r => r.json())
            .then(posts => {
              console.log(posts);
              if (append) {
                this.setState({ posts: this.state.posts.concat(posts.data.postsByUser), isLoading: false, hasAdditionalPosts: posts.data.postsByUser.length === 10 }, () => {
                  console.log("posts appended", posts.data.postsByUser);
                });
              } else {
                this.setState({ posts: posts.data.postsByUser, isLoading: false, hasAdditionalPosts: posts.data.postsByUser.length === 10 }, () => {
                  window.scrollTo(0, 0)
                });
              }
            });
    }

    render() {
        return (
            <Feed
              showsComposer={false}
              key={this.state.selectedType === "org" ? this.state.selectedOrgId : this.state.selectedTopicName}
              parallelOrgs={this.state.parallelOrgs}
              composerTag={this.state.composerTag}
              org={this.state.selectedOrg}
              setSelectedOrg={this.props.setSelectedOrg}
              setSelectedTopic={this.props.setSelectedTopic}
              selectedType={this.state.selectedType}
              reset={this.state.reset}
              selectedOrgName={this.state.selectedOrgName}
              selectedOrgId={this.state.selectedOrgId}
              selectedTopicName={this.state.selectedTopicName}
              selectedIdentity={this.state.selectedIdentity}
              setFormState={this.props.setFormState}
              posts={this.state.posts}
              username={this.props.username}
              user_id={this.props.user_id}
            />
        )
    }
}

export default PostsFromUser;