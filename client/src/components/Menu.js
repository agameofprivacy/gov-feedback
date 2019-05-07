import React, { Component } from "react";
import IconButton from "../components/IconButton";

class Menu extends Component {

    state={
        loggedIn: false
    }

    render() {
        const { dismissLogin } = this.props;

        if (!this.state.loggedIn) {
            return (
                <div className="navbar__menu">
                    <input type="email" name="email" className="navbar__menu__input" placeholder="Email" />
                    <input type="password" name="password" className="navbar__menu__input" placeholder="密碼" />
                    <button className="pill pill--primary--dark navbar__menu__button">登入</button>
                    <button className="pill pill--primary--dark navbar__menu__button">註冊</button>
                    <button
                        onClick={dismissLogin}
                        className="navbar__button navbar__button--secondary"
                    >
                        <IconButton type="close" />
                    </button>
                </div>
            )
        }
    }
}

export default Menu;