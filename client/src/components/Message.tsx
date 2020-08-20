import React from "react";

type MessageProps = {
  msg: String;
};

const Message: React.FC<MessageProps> = (messageProps) => {
  const { msg } = messageProps;
  return (
    <div>
      <div
        className="alert alert-danger alert-dismissible fade show"
        role="alert"
      >
        {msg}
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );
};

export default Message;
