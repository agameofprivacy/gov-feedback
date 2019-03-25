import React, { Component } from "react";

class BaseModal extends Component {

    handleModalClick = (e) => {
        console.log(e);
    }

    render() {
        const { 
            title, 
            small, 
            medium, 
            large,
            footerActions,
            footer
        } = this.props;

        var headerActionIcon;
        switch(this.props.headerActionIcon) {
            case "close":
            default:
            headerActionIcon =                         
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
            break;
        }

        var headerAction = 
            <button
                id="modal-close"
                onClick={this.props.headerAction}
                className="modal__dialog__header__action"
            >
            {headerActionIcon}
            </button>

        // var footerActions = [];
        // this.props.footerActions.forEach((action) => {
        //     switch(action) {
        //         case "cancel":
        //             footerActions.push(
        //                 <button
        //                     id="modal-cancel"
        //                     onClick={this.handleModalClick}
        //                     className="modal__dialog__footer__action modal__dialog__footer__action--secondary"
        //                 >
        //                     取消
        //                 </button>      
        //             )
        //             break;
        //         case "confirm":
        //             footerActions.push(
        //                 <button
        //                     id="modal-cancel"
        //                     onClick={this.handleModalClick}
        //                     className="modal__dialog__footer__action modal__dialog__footer__action--secondary"
        //                 >
        //                     取消
        //                 </button>      
        //             )
        //             break;
        //         default:
        //             break;
        //     }
        // });

        return (
            <div className="modal">
                <div className="modal__shade">
                    <div 
                        className={
                            "modal__dialog" + 
                            (small ? " modal__dialog--small" : "") +
                            (medium ? " modal__dialog--medium" : "") +
                            (large ? " modal__dialog--large" : "")
                        }
                    >
                        <div className="modal__dialog__header">
                            {headerAction}
                            <h2 className="modal__dialog__header__title">
                                {title}
                            </h2>
                        </div>
                        <div className="modal__dialog__body">
                            {this.props.children}
                        </div>

                        { footerActions.length > 0 &&
                            <div className="modal__dialog__footer">
                                {footerActions}
                            </div>
                        }
                        { footer !== undefined &&
                            {footer}
                        }
                    </div>
                </div>
            </div>
        )
        
    }
}

export default BaseModal;