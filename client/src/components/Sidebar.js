import React, {Component} from "react";
import Tabs from "./Tabs";
import Contact from "./Contact";
import RelatedOrgs from "./RelatedOrgs";
import Pills from "./Pills";
import RadioSelect from "./RadioSelect";

class Sidebar extends Component {

    state={
        selectedTab: 0,
        selectedFreq: "",
        selectedChannel: "email",
    }

    handlePillClick = (identifier) => {
        console.log(identifier[0], identifier[1]);
        this.props.setSelectedOrg({
            name: identifier[1],
            identifiers: [
                {
                    identifier: identifier[0]
                }
            ]
        })
    }

    setSelectedTab = (index) => {
        this.setState({selectedTab: index});
    }

    saveSubsciption = (value) => {
        if (["every", "daily", "weekly"].includes(value)) {
            this.setState({selectedFreq: value});
        } else {
            this.setState({selectedChannel: value});
        }
    }



    render() {
        const {org, parallelOrgs, topic, selectedType} = this.props;

        var collections = [];
        if (org !== null && typeof org !== "undefined" && org.parent !== null) {
            collections.push({
                "label": "上級機關",
                "entries": [
                    {
                        "name": org.parent.name,
                        "identifier": org.parent.identifiers[0].identifier
                    }
                ]
            })
        }

        if (parallelOrgs !== null && parallelOrgs.length > 0) {
            var entries = [];
            parallelOrgs.forEach((org => {
                entries.push({
                    "name": org.name,
                    "identifier": org.identifiers[0].identifier
                })
            }))
            collections.push({
                "label": `平行機關 (${entries.length})`,
                "entries": entries
            });
        }

        var hotTopics = [];
        if (org !== undefined && org !== null) {
            var topicsWeek = org.topicsWeek.sort((a, b) => {
                return a.count - b.count;
            })
            topicsWeek.forEach((topic) => {
                hotTopics.push(topic.name);
            })
        }

        var hotOrgs = [];
        if (topic !== undefined && topic !== null) {
            var orgsWeek = topic.orgsWeek.sort((a, b) => {
                return a.count - b.count;
            })
            orgsWeek.forEach((org) => {
                hotOrgs.push(org.name);
            })
        }

        const sections = (this.props.selectedType === "org" && this.props.org === undefined) || (this.props.selectedType === "topic" && this.props.topic === undefined) ? [] : [
            {
              "title": "通知方式",
              "options": [
                {
                  "title": "電子郵件",
                  "subtitle": "agameofprivacy@gmail.com",
                  "value": "email"
                },
              ]
            },
            {
              "title": "通知頻率",
              "options": [
                {
                    "title": "每次",
                    "subtitle": `每次有人對 ${this.props.selectedType === "org" ? this.props.org.name : this.props.topic.name} 發布新的回饋`,
                    "value": "every"
                },
                {
                    "title": "每天",
                    "subtitle": `每天收到一個彙整當天 ${this.props.selectedType === "org" ? this.props.org.name : this.props.topic.name} 回饋
                    的通知`,
                    "value": "daily"
                },
                {
                    "title": "每週",
                    "subtitle": `每週收到一個彙整當週 ${this.props.selectedType === "org" ? this.props.org.name : this.props.topic.name} 回饋
                    的通知`,
                    "value": "weekly"
                }
              ]
            }
          ];
        

        return (
            <div className="sidebar">
                <Tabs setSelectedTab={this.setSelectedTab} selectedTab={this.state.selectedTab} tabs={["關於", "關注"]} />
                {
                    selectedType === "org" && org !== undefined && this.state.selectedTab === 0 && collections.length > 0 &&
                    <RelatedOrgs collections={collections} handlePillClick={this.handlePillClick} />
                }
                {
                    selectedType === "org" && org !== undefined && org !== null && this.state.selectedTab === 0 &&
                    <Contact contacts={org.contact_details} />
                }
                {
                    selectedType === "org" && org !== undefined && this.state.selectedTab === 0 && hotTopics.length > 0 &&
                    <div className="section">
                        <div className="section__title-container m-b-1">
                            <h3 className="section__title-container__title">熱門議題</h3>
                        </div>
                        <Pills pills={hotTopics} />
                    </div>
                }
                {
                    selectedType === "topic" && topic !== undefined && topic !== null && this.state.selectedTab === 0 &&
                    <div className="section">
                        <div className="section__title-container m-b-1">
                            <h3 className="section__title-container__title">熱門機關</h3>
                        </div>
                        <Pills pills={hotOrgs} />
                    </div>
                }
                {
                    this.state.selectedTab === 1 &&
                    <div className="section">
                        <p>{`若您想持續關注 ${this.props.selectedType === "org" ? this.props.org ? this.props.org.name : "" : this.props.topic ? this.props.topic.name : ""} 在平台的回饋動態，您可以由下列通知管道與通知頻率各擇一。`}</p>
                        <RadioSelect submitForm={this.saveSubsciption} sections={sections} />
                    </div>
                }
            </div>
        )
    }
}

export default Sidebar;