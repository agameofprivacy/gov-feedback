import React, { Component } from "react";
import BaseModal from "./BaseModal";
import FormInput from "./FormInput";
import FormInputs from "./FormInputs";

class LoginModal extends Component {

    state = {
        username: "",
        password: "",
        confirmPassword: "",
        passwordConfirmed: false,
        confirmingPassword: false,
    }

    closeLoginModal = () => {
        this.props.setFormState({showsLoginModal: false});
    }

    login = () => {
        console.log("login");
        // process login then close modal
        console.log("user: ", this.state.username);
        console.log("password: ", this.state.password);
        this.closeLoginModal();
    }

    register = () => {
        console.log("register");
        this.setState({confirmingPassword: true});
    }

    completeRegistration = () => {
        // process registration then close modal
        console.log("complete registration");
        console.log("user: ", this.state.username);
        console.log("password: ", this.state.password);
    }

    updateValue = (name, value) => {
        switch(name) {
            case "帳號":
                this.setState({username: value});
                break;
            case "密碼":
                this.setState({password: value});
                break;
            case "確認密碼":
                this.setState({confirmPassword: value}, () => {
                    this.setState({passwordConfirmed: this.state.password === this.state.confirmPassword});
                })
                break;
            default:
                break;
        }
    }

    render() {

        var footerActions = [];
        if (!this.state.passwordConfirmed && this.state.confirmingPassword) {
            footerActions.push(
                <button
                    key="footer-confirm-password"
                    id="modal-confirm-password"
                    onClick={this.confirmPassword}
                    className="modal__dialog__footer__action modal__dialog__footer__action--primary"
                >
                    下一步
                </button>
            )
        } else if (this.state.passwordConfirmed && this.state.confirmingPassword) {
            footerActions.push(
                <button
                    key="footer-complete-registration"
                    id="modal-complete-registration"
                    onClick={this.completeRegistration}
                    className="modal__dialog__footer__action modal__dialog__footer__action--primary"
                >
                    完成註冊
                </button>
            );

        } else {
            footerActions.push(
                (
                    <button
                        key="footer-register"
                        id="modal-register"
                        onClick={this.register}
                        className="modal__dialog__footer__action modal__dialog__footer__action--start modal__dialog__footer__action--secondary"
                    >
                        註冊
                    </button>
                ),
                (
                    <button
                        key="footer-submit"
                        id="modal-submit"
                        onClick={this.login}
                        className="modal__dialog__footer__action modal__dialog__footer__action--primary"
                    >
                        登入
                    </button>
                )
            )
        }

        return (
            <BaseModal medium title="我的回饋平台" headerAction={this.closeLoginModal} headerActionIcon="close" footerActions={footerActions} >
                <FormInputs>
                    <FormInput labelText="帳號" inputType="email" placeholder="jane@example.com" value={this.state.username} updateValue={this.updateValue} />
                    <FormInput labelText="密碼" inputType="secure-text" placeholder="6個以上的英文字母、數字或其他特別字元" value={this.state.password} updateValue={this.updateValue} />
                    { this.state.confirmingPassword &&
                        <FormInput labelText="確認密碼" inputType="secure-text" placeholder="6個以上的英文字母、數字或其他特別字元" value={this.state.password} updateValue={this.updateValue} />
                    }
                </FormInputs>
            </BaseModal>
        )
    }
}

export default LoginModal;