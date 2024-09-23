import React from "react";
import { Dropdown } from "semantic-ui-react";

export default function Messages({
  handleOnMessageChange,
  messages: data,
  selected,
  multiple = false,
  placeholder = "Select Prospective Clients",
}) {
  let allMessages = [];
  data.forEach((message) => {
    allMessages.push({
      key: message.id,
      text: message.whatsappPhoneNumber,
      value: message.id,
    });
  });
  return (
    <div>
      {allMessages && (
        <Dropdown
          placeholder={placeholder}
          fluid
          search
          clearable
          selection
          multiple={multiple}
          required
          defaultValue={selected}
          onChange={handleOnMessageChange}
          options={allMessages}
        />
      )}
    </div>
  );
}
