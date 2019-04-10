import React, {Component} from "react";
import Pill from "./Pill";
const chroma = require("chroma-js");

var remote = "https://gov-feedback.appspot.com";
var local= "http://localhost:3001";

const host = local;

class SubscriptionsList extends Component {

    state = {
        topicSubs: [],
        orgSubs: []
    }

    getColors = (count) => {
        let MIN_CONTRAST_RATIO = 5,
            MIN_LUMINANCE = 0.05,
            WHITE = chroma('white')
      
        let bg = null,
            text = null;
        var colors = [];
    
        do {
            bg = chroma.random();
            let contrastWithWhite = chroma.contrast(bg, WHITE)
            if (contrastWithWhite >= MIN_CONTRAST_RATIO && bg.luminance() >= MIN_LUMINANCE) {
                text = WHITE;
                colors.push(bg);
            }
        } while (text === null || colors.length < count);
        return colors;
    }    

    componentDidMount = () => {
        this.fetchSubscriptionForUser(this.props.user_id);
    }

    colors;
    identifiers = [];

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
                      identifiers{
                        scheme
                        identifier          
                      }
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
            console.log("num of colors: ", sub.data.subscriptionForUser.organizations.length + sub.data.subscriptionForUser.topics.length);
            this.colors = this.getColors(sub.data.subscriptionForUser.organizations.length + sub.data.subscriptionForUser.topics.length);
            sub.data.subscriptionForUser.organizations.forEach((org) => {
                this.identifiers.push(org.organization._id);
            })
            sub.data.subscriptionForUser.topics.forEach((topic) => {
                this.identifiers.push(topic.topic._id);
            })
            this.setState({
                orgSubs: sub.data.subscriptionForUser.organizations,
                topicSubs: sub.data.subscriptionForUser.topics
            })
        })
    }

    frequencyDict = {
        "asap": "即時",
        "daily": "每日",
        "weekly": "每週",
    }

    handleTagClick = e => {
        var index = this.identifiers.indexOf(e.target.getAttribute("value"));
        console.log("index is: ", index);
        var type;
        if (index <= this.state.topicSubs.length - 1) {
            type = "topic";
            this.props.setSelectedTopic(e.target.getAttribute("value"));
        } else {
            type = "org";
            console.log("org: ", this.state.orgSubs[index - this.state.topicSubs.length].organization);
            this.props.setSelectedOrg(this.state.orgSubs[index - this.state.topicSubs.length].organization);
        }
      };
    
    render() {
        console.log("colors", this.colors);
        var subscriptions = [];   
    
        this.state.topicSubs.forEach((sub, index) => {
            var color = this.colors[index];
            console.log("topicSub: ", sub)
            subscriptions.push(
                <div className="subscription-item" key={sub.topic.name}>
                    <Pill
                        handleClick={this.handleTagClick}
                        color={color}
                        label={sub.topic.name}
                        value={
                            sub.topic.name
                        }
                        type="link"
                    />
                </div>
            )
        })
        this.state.orgSubs.forEach((sub, index) => {
            console.log("orgSub: ", sub)
            var color = this.colors[this.state.topicSubs.length + index];
            subscriptions.push(
                <div className={"subscription-item" + (index === this.state.topicSubs.length + this.state.orgSubs.length - 1 ? " subscription-item--last" : "")} key={sub.organization.name}>
                    <Pill
                        handleClick={this.handleTagClick}
                        color={color}
                        label={sub.organization.name}
                        value={
                            sub.organization._id
                        }
                        type="link"
                    />
                    <div className="subscription-item__box">
                        <div className="subscription-item__box__status">{this.frequencyDict[sub.frequency]}</div>
                        <div className="subscription-item__box__action">停止關注</div>
                    </div>
                </div>
            )
        })
    
        return (
            <div>
                {subscriptions}
            </div>
        )
    }
}

export default SubscriptionsList;