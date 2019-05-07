import React, { Component } from "react";
import Tabs from "./Tabs";
import Contact from "./Contact";
import RelatedOrgs from "./RelatedOrgs";
import Pills from "./Pills";
import RadioSelect from "./RadioSelect";

var remote = "https://gov-feedback.appspot.com";
var local= "http://localhost:3001";

const host = local;

class Sidebar extends Component {
  state = {
    selectedTab: 0,
    selectedFreq: "",
    selectedChannel: "email",
    subscription: "",
    topicIdentifier: "",
  };

  handlePillClick = identifier => {
    console.log(identifier[0], identifier[1]);
    this.props.setSelectedOrg({
      name: identifier[1],
      identifiers: [
        {
          identifier: identifier[0]
        }
      ]
    });
  };

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
        var subscription = sub.data.subscriptionForUser;
        var subscribedOrgIds = [];
        var subscribedTopicNames = [];
        if (subscription) {
          subscription.organizations.forEach((org) => {
            subscribedOrgIds.push(org.organization._id);
          })
          subscription.topics.forEach((topic) => {
            subscribedTopicNames.push(topic.topic.name);
          })
          console.log("this.props.selectedIdentifier", this.props.selectedIdentifier);
          console.log("subscribedOrgIds", subscribedOrgIds);
          console.log("subscribedTopicNames", subscribedTopicNames);
  
          if (subscribedOrgIds.includes(this.props.selectedOrgDatabaseId)){
            this.setState({
              subscription: subscription.organizations[subscribedOrgIds.indexOf(this.props.selectedOrgDatabaseId)].frequency,
              selectedFreq: subscription.organizations[subscribedOrgIds.indexOf(this.props.selectedOrgDatabaseId)].frequency
            })
          } else if (subscribedTopicNames.includes(this.props.selectedIdentifier)) {
            this.setState({
              subscription: subscription.topics[subscribedTopicNames.indexOf(this.props.selectedIdentifier)].frequency,
              selectedFreq: subscription.topics[subscribedTopicNames.indexOf(this.props.selectedIdentifier)].frequency,
              topicIdentifier: subscription.topics[subscribedTopicNames.indexOf(this.props.selectedIdentifier)].topic._id,
            })
          }
          else {
            this.setState({
              subscription: "never",
              selectedFreq: "never"
            })
          }
        } else {
          // subscription doesn't exist
          this.setState({
            subscription: "never",
            selectedFreq: "never"
          })
        }
        
        
        // this.setState({ posts: posts.data.postsForTopic });
      });
  }

  setSelectedTab = index => {
    if (index === 1 && this.state.subscription === ""){
      // fetch subscription
      this.fetchSubscriptionForUser(this.props.user_id);
    }
    this.setState({ selectedTab: index });
  };

  updateSubscription = (input, callback) => {
    console.log("update sub");
    console.log("input", input);
    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `
          mutation($input: SubscriptionInput){
            updateSubscription(input: $input) {
              user
              topics{
                frequency
              }
              organizations{
                frequency
              }
            }
          }
        `,
        variables: { input }
      })
    })
      .then(r => r.json())
      .then(response => {
        callback(response);
      });
  };


  saveSubsciption = value => {
    if (["asap", "daily", "weekly", "never"].includes(value)) {
      this.setState({ selectedFreq: value, subscription: value }, () => {
        console.log(this.state.selectedFreq)
        var input = {
          "user": this.props.user_id,
          "action": this.state.subscription === "never" ? "unsubscribe" : "subscribe",
          "subscription_type": this.props.selectedType === "org" ? "organization" : "topic",
          "subscription_target": this.props.selectedType === "org" ? this.props.selectedOrgDatabaseId : this.state.topicIdentifier,
          "subscription_frequency": this.state.subscription      
        };
        this.updateSubscription(input,
        (r) => {
          console.log(r);
        })
      });
      
    } else {
      this.setState({ selectedChannel: value });
    }
  };

  render() {
    const { org, parallelOrgs, topic, selectedType } = this.props;

    var collections = [];
    if (org !== null && typeof org !== "undefined" && org.parent !== null) {
      collections.push({
        label: "上級機關",
        entries: [
          {
            name: org.parent.name,
            identifier: org.parent.identifiers[0].identifier
          }
        ]
      });
    }

    if (parallelOrgs !== null && parallelOrgs.length > 0) {
      var entries = [];
      parallelOrgs.forEach(parallelOrg => {
        entries.push({
          name: parallelOrg.name,
          identifier: parallelOrg.identifiers[0].identifier
        });
      });
      collections.push({
        label: `平行機關 (${entries.length})`,
        entries: entries
      });
    }

    var hotTopics = [];
    if (org !== undefined && org !== null) {
      var topicsWeek = org.topicsWeek.sort((a, b) => {
        return a.count - b.count;
      });
      topicsWeek.forEach(topic => {
        hotTopics.push(topic.name);
      });
    }

    var hotOrgs = [];
    if (topic !== undefined && topic !== null) {
      var orgsWeek = topic.orgsWeek.sort((a, b) => {
        return a.count - b.count;
      });
      orgsWeek.forEach(org => {
        hotOrgs.push(org.name);
      });
    }

    const sections =
      (this.props.selectedType === "org" && this.props.org === undefined) ||
      (this.props.selectedType === "topic" && this.props.topic === undefined)
        ? []
        : [
            {
              title: "通知頻率",
              options: [
                {
                  title: "不通知",
                  subtitle: `不收到通知`,
                  value: "never"
                },
                {
                  title: "即時",
                  subtitle: `每次有新回饋就通知`,
                  value: "asap"
                },
                {
                  title: "每日",
                  subtitle: `彙整當天回饋的通知`,
                  value: "daily"
                },
                {
                  title: "每週",
                  subtitle: `彙整當週回饋的通知`,
                  value: "weekly"
                }
              ]
            }
          ];

    return (
      <div className="sidebar">
        <Tabs
          setSelectedTab={this.setSelectedTab}
          selectedTab={this.state.selectedTab}
          tabs={["關於", "關注"]}
        />
        {selectedType === "org" &&
          org !== undefined &&
          this.state.selectedTab === 0 &&
          collections.length > 0 && (
            <RelatedOrgs
              key={this.props.selectedIdentifier}
              collections={collections}
              handlePillClick={this.handlePillClick}
            />
          )}
        {selectedType === "org" &&
          org !== undefined &&
          org !== null &&
          this.state.selectedTab === 0 && (
            <Contact contacts={org.contact_details} />
          )}
        {selectedType === "org" &&
          org !== undefined &&
          this.state.selectedTab === 0 &&
          hotTopics.length > 0 && (
            <div className="section">
              <div className="section__title-container m-b-1">
                <h3 className="section__title-container__title">熱門議題</h3>
              </div>
              <Pills pills={hotTopics} />
            </div>
          )}
        {selectedType === "topic" &&
          topic !== undefined &&
          topic !== null &&
          this.state.selectedTab === 0 && (
            <div className="section">
              <div className="section__title-container m-b-1">
                <h3 className="section__title-container__title">熱門機關</h3>
              </div>
              <Pills pills={hotOrgs} />
            </div>
          )}
        {this.state.selectedTab === 1 && (
          <div className="section">
            <p>{`若想收到`} <strong>{
              this.props.selectedType === "org"
                ? this.props.org
                  ? this.props.org.name
                  : ""
                : this.props.topic
                ? this.props.topic.name
                : ""
            }</strong> {`相關通知email，請調整下面設定。`}</p>
            <RadioSelect
              loaded={this.state.subscription !== ""}
              submitForm={this.saveSubsciption}
              sections={sections}
              value={this.state.subscription}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Sidebar;
