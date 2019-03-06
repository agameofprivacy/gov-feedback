import React, {Component} from "react";
import PillSearch from "./PillSearch";
import RadioSelect from "./RadioSelect";
import ConfirmFeedback from "./ConfirmFeedback";

class Modal extends Component {

    state = {
        composerTag: "",
        composerValue: "",
        selectedIdentity: "",
        identiyConfirmed: false
    };

    submitForm = (value, label) => {
        switch(this.props.type) {
            case "tag-search":
                this.setState({composerValue: value, composerTag: label}, function(){
                    console.log(this.state);
                });
                break;
            case "identity-select":
                this.setState({selectedIdentity: value});
                break;
            default:
                break;
        }
    }

    handleModalClick = (e) => {
        if (e.target.id === "modal-submit") {
            switch(this.props.type) {
                case "tag-search":
                    this.props.setFormState({composerTag: this.state.composerTag, composerValue: this.state.composerValue, showsModal: false});
                    break;
                case "identity-select":
                    this.props.setFormState({selectedIdentity: this.state.selectedIdentity});
                    break;
                default:
                    this.props.setFormState({showsModal: false});
                    break;
            }
        } else if (e.target.id === "identity-next") {
            this.setState({identiyConfirmed: true});
            this.props.setFormState({selectedIdentity: this.state.selectedIdentity});
        } else {
            this.props.setFormState({showsModal: false});
        }
    }

    render(){
 
        const {type, data} = this.props;
        var title;

        switch(type) {
            case "tag-search":
                if (this.props.selectedType === "org") {
                    title = "選擇話題標籤";
                } else {
                    title = "選擇回饋機關";
                }
                break;
            case "identity-select":
                title = "選擇發佈身份";
                break;
            default:
                break;
        }

        var confirmFeedbackTags = [];
        switch(this.props.selectedType) {
            case "org":
                confirmFeedbackTags.push(this.props.selectedOrgName);
                break;
            case "topic":
                confirmFeedbackTags.push(this.props.selectedTopic.name);
                break;
            default:
                break;
        }
        confirmFeedbackTags.push(this.props.composerTag);

        return (
            <div className="modal">
                <div className="modal__shade">
                    <div className="modal__dialog modal__dialog--small">
                        <div className="modal__dialog__header">
                            <button id="modal-close" onClick={this.handleModalClick} className="modal__dialog__header__action">
                                <svg>
                                    <g fill="none" fillRule="evenodd">
                                        <path
                                            d="M10 0C4.47 0 0 4.47 0 10s4.47 10 10 10 10-4.47 10-10S15.53 0 10 0zm5 13.59L13.59 15 10 11.41 6.41 15 5 13.59 8.59 10 5 6.41 6.41 5 10 8.59 13.59 5 15 6.41 11.41 10 15 13.59z"
                                            fill="#C9C9C9"
                                            fillRule="nonzero"
                                        />
                                        <path d="M-2-2h24v24H-2z" />
                                    </g>
                                </svg>
                            </button>
                            <h2 className="modal__dialog__header__title">
                                {this.props.composerTag !== "" && this.props.selectedIdentity !== "" && this.state.identiyConfirmed ? "檢查回饋內容" : title}
                            </h2>
                        </div>
                        <div className="modal__dialog__body">
                            {
                                type === "tag-search" &&
                                <PillSearch selectedTopic={this.props.selectedTopic} selectedOrg={this.props.selectedOrg} submitForm={this.submitForm} type={this.props.selectedType} />
                            }
                            {
                                type === "identity-select" && !this.state.identiyConfirmed &&
                                <RadioSelect submitForm={this.submitForm} sections={data} />
                            }
                            {
                                type === "identity-select" && this.state.identiyConfirmed &&
                                <ConfirmFeedback tags={confirmFeedbackTags} content={this.props.content} identity={this.props.selectedIdentity} />
                            }
                            {this.props.children}
                        </div>
                        <div className="modal__dialog__footer">
                            {
                                type === "tag-search" &&
                                <button id="modal-cancel" onClick={this.handleModalClick} className="modal__dialog__footer__action modal__dialog__footer__action--secondary">
                                    取消
                                </button>
                            }
                            {
                                type === "tag-search" &&
                                <button id="modal-submit" onClick={this.handleModalClick} className="modal__dialog__footer__action modal__dialog__footer__action--primary">
                                    確認
                                </button>
                            }
                            {
                                type === "identity-select" && !this.state.identiyConfirmed &&
                                <button id="identity-next" onClick={this.handleModalClick} className="modal__dialog__footer__action modal__dialog__footer__action--primary">
                                    下一步
                                </button>
                            }
                            {
                                type === "identity-select" && this.state.identiyConfirmed &&
                                <button id="feedback-submit" onClick={this.props.createPostWithComposer} className="modal__dialog__footer__action modal__dialog__footer__action--primary">
                                    發佈回饋
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal;