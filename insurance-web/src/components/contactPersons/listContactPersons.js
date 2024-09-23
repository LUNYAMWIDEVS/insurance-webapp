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
import { useLazyQuery } from '@apollo/react-hooks';
import { ContactPersonContext } from '../../context/contactPerson';
import { GET_CONTACT_PERSONS } from './queries'
import '../root.scss';
import { AuthContext } from '../../context/auth';

export default function ContactPersonRecords(props) {
  const authContext = useContext(AuthContext);
  const context = useContext(ContactPersonContext);
  const [fetched, setFetched] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    search: ""
  });

  // const [clientTotals, setClientTotals] = useState();
  const [contacts, setContacts] = useState([]);

  const [fetchContacts, { loading, data }] = useLazyQuery(GET_CONTACT_PERSONS, { variables: pagination });
  useEffect(() => {
    if (data) {
      setContacts(data.contactPersons);
      setFetched(true);
    }
    if (!fetched) {
      fetchContacts()
      if (data) {
        context.getContactPersons(data.contactPersons)
      }
    }
  }, [data, context, fetched, fetchContacts]);

  const handleOnPageChange = (e, data) => {
    e.preventDefault()
    setPagination({ ...pagination, page: data.activePage })
  }
  const handleOnSearch = (e) => {
    e.preventDefault()
    setPagination({ ...pagination, search: e.target.value })

  }


  function contactPersonsList() {

    return (
      <Grid container columns={5} className={loading ? "loading" : ''}>
        <Grid.Row>
          <Grid.Column>
            <Header as="h4">Name</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h4">Email</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h4">Phone Number</Header>
          </Grid.Column>
          {/* <Grid.Column>
            <Header as="h4">Residence</Header>
          </Grid.Column> */}
          <Grid.Column>
            <Header as="h4">Join Date</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h4">Gender</Header>
          </Grid.Column>
        </Grid.Row>

        { contacts.items ? contacts.items.map((contact, key) =>
          <Grid.Row key={contact.id}>
            <Grid.Column>
              <span>{key + 1}. </span>
              <span style={{ textTransform: 'titlecase' }}>{contact.name}</span>
            </Grid.Column>
            <Grid.Column>
              <span style={{ fontSize: ".9em" }}>{contact.email}</span>
            </Grid.Column>
            <Grid.Column>
              {contact.phoneNumber}
            </Grid.Column>
            {/* <Grid.Column>
              {contact.town}
            </Grid.Column> */}
            <Grid.Column>
              {moment(contact.createdAt).format('DD/MM/YYYY')}
            </Grid.Column>
            <Grid.Column>
              <Grid>

                <Grid.Column floated='left' width={3}>
                  {contact.gender}
                </Grid.Column>
                <Grid.Column width={1} floated='left'>
                  <Link to={`/staff/dashboard/contact-person/profile/${contact.id}`}>
                    <Button icon >
                      <Icon name='external alternate' />
                    </Button>
                  </Link>
                </Grid.Column>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        ) : 'No Contact Persons Available'}

      </Grid>
    )
  }

  const panes = [
    {
      menuItem: (
        <Menu.Item key='contacts'>
          Contact Persons<Label>{contacts.count}</Label>
        </Menu.Item>
      ),
      render: () => {
        return (
          <Tab.Pane>
            {contactPersonsList()}
            <br />
            {contacts.pages && <Pagination
              defaultActivePage={contacts.page}
              firstItem={null}
              lastItem={null}
              pointing
              secondary
              onPageChange={handleOnPageChange}
              totalPages={contacts.pages}
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
                <a href="/staff/dashboard/overview">Overview</a> {'>'} <a href="/staff/dashboard/crm">CRM</a> {'>'} Contact Persons Records
                <Header.Subheader>
                  Hey there {authContext.user.username}, here is your contact persons dashboard
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>

        <Grid.Column width={3} className="clear-left">
          <Button href="/staff/dashboard/add-new-contact-person" color='blue'>+ Register Contact Person</Button>
        </Grid.Column>
      </Grid>

      <Grid container columns={1} padded>
        <Grid.Column>
          <Form>
            <Form.Group>
              <Form.Input
                placeholder='Name, Email, Id Number ...'
                name='name'
                onChange={handleOnSearch}
              />
              <Form.Button icon size={'medium'} onClick={(e) => { e.preventDefault(); fetchContacts() }}>
                <Icon name="search" />
            Find Client
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
