import React, {Component} from "react";
import Tabs from "./Tabs";
import Contact from "./Contact";
import RelatedOrgs from "./RelatedOrgs";
import Pills from "./Pills";

class Sidebar extends Component {

    render() {
        const {selectedIndex} = this.props;

        let contacts = [
            {
                "label": "電話",
                "value": "(02) 2521-6555",
            },
            {
                "label": "地址",
                "value": "臺北市中山區南京東路2段1號",
            },
            {
                "label": "電子郵件信箱",
                "value": "tpy@mail.moj.gov.tw",
            },
            {
                "label": "臉書粉絲團",
                "value": "facebook.com/tpymoj",
            }
        ];

        let collections = [
            {
                "label": "上級機關",
                "entries": [
                    {
                        "name": "行政執行署",
                        "identifier": ""
                    }
                ]
            },
            {
                "label": "平行機關",
                "entries": [
                    {
                        "name": "行政執行署士林分署",
                        "identifier": ""
                    },
                    {
                        "name": "行政執行署新北分署",
                        "identifier": ""
                    }
                ]
            }
        ];

        let pills = [
            "新案管",
            "案管當機",
            "案管問題",
            "案管廠商",
            "電子憑證未發",
        ];

        return (
            <div className="sidebar">
                <Tabs selectedIndex={selectedIndex} tabs={["關於", "關注"]} />
                {
                    selectedIndex === 0 &&
                    <Contact contacts={contacts} />
                }
                {
                    selectedIndex === 0 &&
                    <div className="section">
                        <div className="section__title-container m-b-1">
                            <h3 className="section__title-container__title">熱門議題</h3>
                        </div>
                        <Pills pills={pills} />
                    </div>
                }
                                {
                    selectedIndex === 0 &&
                    <RelatedOrgs collections={collections} />
                }
            </div>
        )
    }
}

export default Sidebar;