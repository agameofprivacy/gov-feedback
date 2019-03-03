import React, {Component} from "react";
import Tabs from "./Tabs";
import Contact from "./Contact";
import RelatedOrgs from "./RelatedOrgs";
import Pills from "./Pills";

class Sidebar extends Component {

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

    render() {
        const {selectedIndex, org, parallelOrgs} = this.props;

        var collections = [];
        if (org !== undefined && org.parent !== null) {
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
        if (org !== undefined) {
            var topicsWeek = org.topicsWeek.sort((a, b) => {
                return a.count - b.count;
            })
            topicsWeek.forEach((topic) => {
                hotTopics.push(topic.name);
            })
        }

        return (
            <div className="sidebar">
                <Tabs selectedIndex={selectedIndex} tabs={["關於", "關注"]} />
                {
                    org !== undefined && selectedIndex === 0 && hotTopics.length > 0 &&
                    <div className="section">
                        <div className="section__title-container m-b-1">
                            <h3 className="section__title-container__title">熱門話題</h3>
                        </div>
                        <Pills pills={hotTopics} />
                    </div>
                }
                {
                    org !== undefined && selectedIndex === 0 &&
                    <RelatedOrgs collections={collections} handlePillClick={this.handlePillClick} />
                }
                {
                    org !== undefined && selectedIndex === 0 &&
                    <Contact contacts={org.contact_details} />
                }
            </div>
        )
    }
}

export default Sidebar;