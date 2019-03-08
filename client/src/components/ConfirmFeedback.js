import React, { Component } from "react";
import Pills from "./Pills";

class ConfirmFeedback extends Component {
  labelDict = {
    custom: "自訂",
    account: "具名",
    anonymous: "匿名"
  };

  render() {
    const { tags, content, identity } = this.props;

    return (
      <div>
        <Pills pills={tags} />
        <p className="m-t-0">{content}</p>
        <p className="confirm-feedback__terms">
          您同意回饋內容遵守 <a href="http://www.google.com">社群規範</a> 且將以{" "}
          <strong>{this.labelDict[identity]}</strong> 身份發表以上回饋。
        </p>
      </div>
    );
  }
}

export default ConfirmFeedback;
