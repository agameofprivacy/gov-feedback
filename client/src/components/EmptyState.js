import React, {Component} from "react";

class EmptyState extends Component {
    render() {

        const {title} = this.props;

        return (
            <div className="empty-state">
                <h3 className="empty-state__title">
                    {title}
                </h3>
            </div>
        )
    }
}

export default EmptyState;