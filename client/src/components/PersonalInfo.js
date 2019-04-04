import React, {Component} from "react";
import KeyValue from "./KeyValue";
import IconButton from "./IconButton";

var remote = "https://gov-feedback.appspot.com";
var local= "http://localhost:3001";

const host = local;

class PersonalInfo extends Component {

    state={
        overFace: false
    }

    updatePersonalInfo = e => {
        console.log("修改個人資料");
        this.props.showProfileModal();
    }

    handleMouseOver = e => {
        this.setState({overFace: true});
    }

    handleMouseOut = e => {
        this.setState({overFace: false});
    }

    handleUploadClick = e => {
        console.log("clicked");
        document.querySelector("input[type=file]").click();
    }

    handleFileSelect = e => {
        console.log(document.querySelector("input[type=file]").value);
        document.querySelector("#pickImageSubmit").click();
    }

    render() {

        const { statKVs, detailKVs, username } = this.props;

        const genderKVs = {
            "male": "男",
            "female": "女",
            "other": "其他"
        }

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
                    v={(detailKV[1] !== "" && detailKV[1] !== null) ? (genderKVs.hasOwnProperty(detailKV[1]) ? genderKVs[detailKV[1]] : detailKV[1]) : "未填"}
                />
            )
        })

        var actions = [];
        actions.push(<button key="update-personal-info" onClick={this.updatePersonalInfo} className="button">修改個人資料</button>)
        
        return (
            <div className="personal-info">
                <div className="personal-info__face">
                    <div className="personal-info__face__container">
                        <img 
                            onMouseOver={this.handleMouseOver} 
                            onMouseOut={this.handleMouseOut} 
                            onClick={this.handleUploadClick}
                            className={"personal-info__face__image" + (this.state.overFace ? " personal-info__face__image--highlighted" : "")}
                            src={`https://scontent.ftpe11-1.fna.fbcdn.net/v/t1.0-9/54410145_10214623991775549_9109365480056946688_n.jpg?_nc_cat=100&_nc_ht=scontent.ftpe11-1.fna&oh=f3478fa8a7f3358a2779b78e41057177&oe=5D200E24`}
                        />
                        <form method="POST" className="hidden" enctype="multipart/form-data" action={`${host}/upload-avatar?user_id=${this.props.user_id}`}>
                            <input onChange={this.handleFileSelect} type="file" id="pickImage" className="hidden" name="avatar-image" />
                            <button type="submit" id="pickImageSubmit" className="hidden" />
                        </form>
                        <IconButton type="upload" className={"personal-info__face__icon" + (!this.state.overFace ? " hidden" : "")} />
                    </div>
                    <h2 className="personal-info__face__name">{username}</h2>
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