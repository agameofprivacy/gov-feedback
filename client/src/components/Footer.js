import React, {Component} from "react";
import logoWhite from '../assets/images/logo--white.png';

class Footer extends Component {

    render() {

        const links = [
            {
              "text": "關於專案",
              "href": "#about",
            },
            {
              "text": "加入志工",
              "href": "#volunteer",
            },
            {
              "text": "贊助管道",
              "href": "#sponsor",
            }
        ];

        var linkItemsArray = [];

        links.forEach((link, index) => {
            linkItemsArray.push(
                <li key={index} className="footer__links__item"><a href={link.href}>{link.text}</a></li>
            )
        })
        return (
            <div className="footer">
                <ul className="footer__links">
                    {linkItemsArray}
                    <li className="footer__links__item"><strong>中文</strong> / EN</li>
                </ul>
                <div className="footer__logo">
                    <img src={logoWhite} alt="logo--white" />
                </div>
            </div>
        );
    }
}

export default Footer;