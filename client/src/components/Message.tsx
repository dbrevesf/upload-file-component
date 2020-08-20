import React from "react";

type MessageProps = {
  msg: String;
  isError: boolean;
};

const Message: React.FC<MessageProps> = (messageProps) => {
  const { msg, isError } = messageProps;  
  const alertSyle = isError ? 'alert-danger' : 'alert-info';
  return (
    <div>
      <div
        className={`alert ${alertSyle} alert-dismissible fade show`}
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
