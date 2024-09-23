import { useLazyQuery } from '@apollo/react-hooks';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Icon,
  Label,
  Menu,
  Pagination,
  Tab
} from 'semantic-ui-react';
import { AuthContext } from '../../context/auth';
import { WhatsAppMessageContext } from '../../context/whatsappMessages';
import '../root.scss';
import { GET_WHATSAPP_MESSAGES } from './queries';

export default function ListWhatsappMessages(props) {
  const authContext = useContext(AuthContext);
  const context = useContext(WhatsAppMessageContext);
  const [fetched, setFetched] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
  });

  const [messages, setMessages] = useState([]);

  const [fetchMessages, { data }] = useLazyQuery(GET_WHATSAPP_MESSAGES, {
    variables: pagination
  });

  useEffect(() => {
    if (data) {
      setMessages(data.whatsappMessages);
      setFetched(true);
    }
  }, [data, context, fetched,]);

  useEffect(() => {
    if (!fetched) {
      fetchMessages()
    }
  })

  const handleOnPageChange = (e, data) => {
    e.preventDefault()
    setPagination({ ...pagination, page: data.activePage })
  }

  const handleOnSearch = (e) => {
    e.preventDefault()
    setPagination({ ...pagination, search: e.target.value })
  }


  function messagesList() {

    return (
      <Grid container columns={5} >
        <Grid.Row>
          <Grid.Column>
            <Header as="h4">Sent At</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h4">WhatsApp Response</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h4">Option</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h4">Enter Chat Room</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h4">Assign Sales Agent</Header>
          </Grid.Column>
        </Grid.Row>

        {messages && messages.items && messages.items.map((message, key) =>
          <Grid.Row key={message.id}>
            <Grid.Column>
              <span>{key + 1}. </span>
              <span >{moment(message.createdAt).format('DD/MM/YYYY, HH:mm:ss')}</span>
            </Grid.Column>
            <Grid.Column>
              {message.whatsappResponse}
            </Grid.Column>
            <Grid.Column floated='left' width={3}>
              {message.option}
            </Grid.Column>
            <Grid.Column floated='left'>
              <Link to={`/staff/dashboard/crm/whatsAppmessage/${message.whatsappPhoneNumber}`}>
                <Button icon >
                  {message.whatsappPhoneNumber}<hr />
                  <Icon name='external alternate' />
                </Button>
              </Link>
            </Grid.Column>
            <Grid.Column floated='left'>
              <Link to={`/staff/dashboard/crm/assignSalesAgent/${message.whatsappPhoneNumber}`}>
                <Button icon >
                  Assign<hr />
                  <Icon name='external alternate' />
                </Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
        )}

      </Grid>
    )
  }

  const panes = [
    {
      menuItem: (
        <Menu.Item key='messages'>
          {/* TODO: implement count  */}
          Messages<Label></Label>
        </Menu.Item>
      ),
      render: () => {
        return (
          <Tab.Pane>
            {messagesList()}
            <br />
            {messages && messages.pages && <Pagination
              defaultActivePage={messages.page}
              firstItem={null}
              lastItem={null}
              pointing
              secondary
              onPageChange={handleOnPageChange}
              totalPages={messages.pages}
            />}
          </Tab.Pane>

        )
      },
    },

  ]

  return (
    <Container>
      <Grid container columns={2} padded>
        <Grid.Column width="equal">
          <div className="content-wrapper">
            <Header as='h2'>
              <Icon name='settings' />
              <Header.Content>
                <a href="/staff/dashboard/overview">Overview</a> {'>'} <a href="/staff/dashboard/crm">CRM</a> {'>'} Messages
                <Header.Subheader>
                  Hey there {authContext.user.username}, here is your contact persons dashboard
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>
        <Grid.Column width={10}>
          <Link 
          to="/staff/dashboard/crm/send-whatsapp-messages">
          <Button>
            Send Dedicated Whatsapp SMS
          </Button>
          </Link>
        </Grid.Column>

      </Grid>

      <Grid container columns={1} padded>
        <Grid.Column>
          <Form>
            <Form.Group>
              <Form.Input
                placeholder='Sms, Email, ...'
                name='name'
                onChange={handleOnSearch}
              />
              <Form.Button icon size={'medium'} onClick={(e) => { e.preventDefault() }}>
                <Icon name="search" />
            Find Message
          </Form.Button>
            </Form.Group>
          </Form>
        </Grid.Column>
      </Grid>

      <Grid container columns={1} padded>
        <Grid.Column>
          <Tab panes={panes} />

        </Grid.Column>
      </Grid>

    </Container>
  )
}
