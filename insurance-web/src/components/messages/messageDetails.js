import React, { useState, useContext, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Container,
  Divider,
  Header,
  Icon,
  Button,
  Menu,
  Tab,
} from "semantic-ui-react";
import "react-chat-elements/dist/main.css";
import { Input } from "react-chat-elements";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { GET_WHATSAPP_MESSAGES, SEND_WHATSAPP_MESSAGE } from "./queries";
import { AuthContext } from "../../context/auth";
import { WhatsAppMessageContext } from "../../context/whatsappMessages";
import NestedMessages from "./nestedMessages";

export default function WhatsAppMessage({ props }) {
  const authContext = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const context = useContext(WhatsAppMessageContext);
  const whatsappPhoneNumber = props.computedMatch.params.whatsappPhoneNumber;
  const [pagination] = useState({
    limit: 10,
    page: 1,
    whatsappPhoneNumber: whatsappPhoneNumber,
  });
  const [values, setValues] = useState({
    whatsappResponse: "",
    whatsappMessageId: "",
  });

  const { data } = useQuery(GET_WHATSAPP_MESSAGES, { variables: pagination });
  useEffect(() => {
    if (data) {
      setMessages(data.whatsappMessages);
    }
  }, [data, context, messages]);

  const [sendMessage] = useCallback(
    useMutation(SEND_WHATSAPP_MESSAGE, {
      update(_, result) {
        window.location.reload();
      },
      onError(err) {
        try {
          console.log(
            err.graphQLErrors && err.graphQLErrors[0]
              ? err.graphQLErrors[0].message
              : err.networkError && err.networkError.result
              ? err.networkError.result.errors
              : err
          );
        } catch (e) {
          console.log(e);
        }
      },
      variables: values,
    })
  );

  const handleChange = (e) => {
    e.preventDefault();
    const message = messages.items.slice(-1)[0];
    const messageId = !!message.previousResponses.length
      ? message.previousResponses[0].id
      : message.id;
    setValues({
      ...values,
      whatsappResponse: e.target.value,
      whatsappMessageId: messageId,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };
  function messageDetails() {
    return (
      <Container>
        {messages.items
          ? messages.items.map((message, key) => (
              <NestedMessages key={key} message={message} />
            ))
          : "No messages"}
        <Divider></Divider>
        <Input
          placeholder="Type here..."
          onChange={handleChange}
          multiline={true}
          rightButtons={
            <Button color="blue" onClick={handleSubmit}>
              Send Message
            </Button>
          }
        />
      </Container>
    );
  }

  const panes = [
    {
      menuItem: <Menu.Item key="Message">Message Details</Menu.Item>,
      render: () => {
        return <Tab.Pane>{messageDetails()}</Tab.Pane>;
      },
    },
  ];

  return (
    <Container>
      <Grid container columns={1} padded>
        <Grid.Column>
          <div className="content-wrapper">
            <Header as="h2">
              <Icon name="file" />
              <Header.Content>
                <a href="/staff/dashboard/overview">Overview</a> {">"}{" "}
                <a href="/staff/dashboard/crm">CRM</a> {">"}{" "}
                <a href="/staff/dashboard/crm/messages">Messages</a> {">"}{" "}
                Message Details
                <Header.Subheader>
                  Hey there {authContext.user.username}, find a list of motor
                  policies under General Insurance below
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>
        <Grid.Column width={10}>
          <Link to="/staff/dashboard/crm/send-whatsapp-messages">
            <Button>Send Dedicated Whatsapp SMS</Button>
          </Link>
        </Grid.Column>
      </Grid>

      <Grid container padded>
        <Grid.Column>
          <Tab panes={panes} />
        </Grid.Column>
      </Grid>
    </Container>
  );
}
