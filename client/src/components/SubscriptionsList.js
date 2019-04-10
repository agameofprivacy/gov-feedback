import React, {Component} from "react";

var remote = "https://gov-feedback.appspot.com";
var local= "http://localhost:3001";

const host = local;

class SubscriptionsList extends Component {

    state = {
        topicSubs: [],
        orgSubs: []
    }

    componentDidMount = () => {
        this.fetchSubscriptionForUser(this.props.user_id);
    }

    fetchSubscriptionForUser = user => {
        fetch(`${host}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            query: `query subscriptionForUser($user: String){
              subscriptionForUser(user: $user) {
                user
                organizations {
                  organization{
                      _id
                      name
                  }
                  frequency
                },
                topics {
                  topic{
                    _id
                    name
                  }
                  frequency
                }
                _id
              }
            }`,
            variables: { user }
          })
        })
          .then(r => r.json())
          .then(sub => {
            console.log("sub: ", sub);
            this.setState({
                orgSubs: sub.data.subscriptionForUser.organizations,
                topicSubs: sub.data.subscriptionForUser.topics
            })
        })
    }


    render() {
        var subscriptions = [];   
    
        this.state.topicSubs.forEach((sub) => {
            console.log("topicSub: ", sub)
            subscriptions.push(
                <div key={sub.topic.name}>{sub.topic.name}</div>
            )
        })
        this.state.orgSubs.forEach((sub) => {
            console.log("orgSub: ", sub)
            subscriptions.push(
                <div key={sub.organization.name}>{sub.organization.name}</div>
            )
        })
    
        return <div>{subscriptions}</div>
    }
}

export default SubscriptionsList;