import React, { Fragment } from "react";
import { MessageBox } from "react-chat-elements";

import "react-chat-elements/dist/main.css";

export default function NestedMessages({ message }) {
  return (
    <Fragment>
      {!message.previousResponses.length && !message.isBot ? (
        <MessageBox
          position={"left"}
          type={"text"}
          text={message.whatsappSms}
          date={new Date(message.createdAt)}
          data={{
            uri: "https://facebook.github.io/react/img/logo.svg",
            status: {
              click: false,
              loading: 0,
            },
          }}
        />
      ) : (
        <MessageBox
          date={new Date(message.createdAt)}
          // reply={{
          //     photoURL: 'https://facebook.github.io/react/img/logo.svg',
          //     title: message.whatsappPhoneNumber,
          //     titleColor: '#8717ae',
          //     message: message.whatsappSms,
          // }}
          onReplyMessageClick={() => console.log("reply clicked!")}
          position={"right"}
          type={"text"}
          text={message.whatsappResponse}
        />
      )}
    </Fragment>
  );
}
