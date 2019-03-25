import React, {Component} from "react";
import KeyValue from "./KeyValue";

class PersonalInfo extends Component {

    updatePersonalInfo = e => {
        console.log("修改個人資料");
        this.props.showProfileModal();
    }

    render() {

        const { statKVs, detailKVs } = this.props;

        var stats = [];

        Object.entries(statKVs).forEach(function(statKV, index){
            console.log(statKV);
            stats.push(
                <div className="stat" key={`stat__${index}`}>
                    <span className="stat__val">
                        {statKV[1]}
                    </span>
                    <span className="stat__key">
                        {statKV[0]}
                    </span>
                </div>
            )
        }.bind(this))

        var details = [];
        Object.entries(detailKVs).forEach(function(detailKV, index){
            console.log(detailKV);
            details.push(
                <KeyValue
                    hugged
                    last={index === Object.entries(detailKVs).length - 1}
                    key={index}
                    k={detailKV[0]}
                    v={detailKV[1]}
                />
            )
        })

        var actions = [];
        actions.push(<button key="update-personal-info" onClick={this.updatePersonalInfo} className="button">修改個人資料</button>)
        
        return (
            <div className="personal-info">
                <div className="personal-info__face">
                    <img src={`https://scontent.ftpe11-1.fna.fbcdn.net/v/t1.0-9/54410145_10214623991775549_9109365480056946688_n.jpg?_nc_cat=100&_nc_ht=scontent.ftpe11-1.fna&oh=f3478fa8a7f3358a2779b78e41057177&oe=5D200E24`} className="personal-info__face__image" />
                    <h2 className="personal-info__face__name">agameofprivacy</h2>
                </div>
                <div className="personal-info__stats">
                    {stats}
                </div>
                <div className="personal-info__details">
                    {details}
                </div>
                <div className="personal-info__actions">
                    {actions}
                </div>
            </div>
        )
    }
}

export default PersonalInfo;