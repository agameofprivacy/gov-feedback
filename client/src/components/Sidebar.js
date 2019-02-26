import React, {Component} from "react";
import Tabs from "./Tabs";
import Contact from "./Contact";
import RelatedOrgs from "./RelatedOrgs";
import Pills from "./Pills";

class Sidebar extends Component {

    render() {
        const {selectedIndex, org, parallelOrgs} = this.props;

        let pills = [
            "新案管",
            "案管當機",
            "案管問題",
            "案管廠商",
            "電子憑證未發",
        ];

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

        return (
            <div className="sidebar">
                <Tabs selectedIndex={selectedIndex} tabs={["關於", "關注"]} />
                {
                    org !== undefined && selectedIndex === 0 &&
                    <Contact contacts={org.contact_details} />
                }
                {
                    org !== undefined && selectedIndex === 0 &&
                    <div className="section">
                        <div className="section__title-container m-b-1">
                            <h3 className="section__title-container__title">熱門議題</h3>
                        </div>
                        <Pills pills={pills} />
                    </div>
                }
                {
                    org !== undefined && selectedIndex === 0 &&
                    <RelatedOrgs collections={collections} />
                }
            </div>
        )
    }
}

export default Sidebar;