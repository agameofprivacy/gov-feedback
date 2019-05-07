import React, {Component} from "react";

class Loader extends Component {
    render(){
        return (
            <div className="loader">
                <div className="loader__spinner">
                    <svg viewBox="0 0 128 128">
                        <g fillRule="nonzero" fill="none">
                        <path
                            fill="#C9C9C9"
                            d="M18.745 119.701l84.853-83.484 5.657 5.566-84.853 83.484z"
                        />
                        <path
                            fill="red"
                            d="M38.996 6.134l58.177 103.262-6.997 3.816L31.999 9.95z"
                        />
                        </g>
                    </svg>
                </div>
            </div>
        )
    }
}

export default Loader;