import React, {Component} from "react";
import Feed from "./Feed";

var remote = "https://gov-feedback.appspot.com";
var local= "http://localhost:3001";

const host = local;

class PostsFromUser extends Component {

    state = {
        posts: []
    }

    componentDidMount = () => {
        this.fetchPostsByUser(this.props.username);
    }

    fetchPostsByUser = user => {
        fetch(`${host}/graphql`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({
              query: `query postsByUser($user: String){
                postsByUser(user: $user){
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
                  }
                  _id
                }
              }`,
              variables: { user }
            })
          })
            .then(r => r.json())
            .then(posts => {
              console.log(posts);
              this.setState({ posts: posts.data.postsByUser });
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
              setFormState={this.setFormState}
              posts={this.state.posts}
              user_id={this.props.user_id}
            />
        )
    }
}

export default PostsFromUser;