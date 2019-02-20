import React, {Component} from "react";
import PillSearch from "./PillSearch";
import RadioSelect from "./RadioSelect";

class Modal extends Component {

    submitForm = () => {
        switch(this.props.type) {
            case "topic-search":
                break;
            case "identity-select":
                break;
            default:
                break;
        }
        this.props.setFormState({showsModal: false});
    }

    handleModalClick = (e) => {
        this.props.setFormState({showsModal: false});
    }

    render(){
 
        const {type, data} = this.props;
        var title;

        switch(type) {
            case "topic-search":
                title = "選擇議題標籤";
                break;
            case "identity-select":
                title = "選擇發佈身份";
                break;
            default:
                break;
        }

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
                                {title}
                            </h2>
                        </div>
                        <div className="modal__dialog__body">
                            {
                                type === "topic-search" &&
                                <PillSearch type="topics" />
                            }
                            {
                                type === "identity-select" &&
                                <RadioSelect sections={data} />
                            }
                            {this.props.children}
                        </div>
                        <div className="modal__dialog__footer">
                            <button id="modal-cancel" onClick={this.handleModalClick} className="modal__dialog__footer__action modal__dialog__footer__action--secondary">
                                取消
                            </button>
                            <button id="modal-submit" onClick={this.handleModalClick} className="modal__dialog__footer__action modal__dialog__footer__action--primary">
                                確認
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal;