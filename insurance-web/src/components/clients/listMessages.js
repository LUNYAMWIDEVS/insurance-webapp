import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Button,
  Container,
  Header,
  Icon,
  Form,
  Label,
  Menu,
  Tab,
  Pagination
} from 'semantic-ui-react';
import moment from 'moment';
import { useQuery } from '@apollo/react-hooks';
import { MessageContext } from '../../context/messages';
import { GET_MESSAGES } from './queries'
import '../root.scss';
import { AuthContext } from '../../context/auth';

export default function ListMessages(props) {
  const authContext = useContext(AuthContext);
  const context = useContext(MessageContext);
  const [fetched, setFetched] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    search: ""
  });

  const [messages, setMessages] = useState([]);

  const { loading, data } = useQuery(GET_MESSAGES, { variables: pagination });
  useEffect(() => {
    if (data) {
      setMessages(data.messages);
      setFetched(true);
    }
    // if (fetched){
    //   context.getMessages(data.messages)
    //   setFetched(false);
    // }
  }, [data, context, fetched,]);

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
      <Grid container columns={5} className={loading ? "loading" : ''}>
        <Grid.Row>
          <Grid.Column>
            <Header as="h4">Sent At</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h4">Email</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h4">SMS</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h4">Option</Header>
          </Grid.Column>
        </Grid.Row>

        { messages.items ? messages.items.map((message, key) =>
          <Grid.Row key={message.id}>
            <Grid.Column>
              <span>{key + 1}. </span>
              <span >{moment(message.createdAt).format('DD/MM/YYYY, HH:mm:ss')}</span>
            </Grid.Column>
            <Grid.Column>
              <span style={{ fontSize: ".9em" }}>{message.emailSubject}</span>
            </Grid.Column>
            <Grid.Column>
              {message.sms}
            </Grid.Column>
            <Grid.Column floated='left' width={3}>
              {message.option}
            </Grid.Column>
            <Grid.Column width={1} floated='left'>
              <Link to={`/staff/dashboard/crm/message/${message.id}`}>
                <Button icon >
                  <Icon name='external alternate' />
                </Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
        ) : 'No Messages Available'}

      </Grid>
    )
  }

  const panes = [
    {
      menuItem: (
        <Menu.Item key='messages'>
          Messages<Label>{messages.count}</Label>
        </Menu.Item>
      ),
      render: () => {
        return (
          <Tab.Pane>
            {messagesList()}
            <br />
            {messages.pages && <Pagination
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
        <Grid.Column>
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

        <Grid.Column width={3} className="clear-left">
          <Button href="/staff/dashboard/crm/send-messages" color='blue'>+ Send Message</Button>
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
