import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Grid,
    Container,
    Divider,
    Header,
    Icon,
    Segment,
    Item,
    Menu,
    Tab,
    Loader
} from 'semantic-ui-react';
import moment from 'moment';
import { useQuery } from '@apollo/react-hooks';
import { MessageContext } from '../../context/messages';
import { GET_MESSAGE } from './queries'
import { AuthContext } from '../../context/auth';

export default function Message({ props }) {
    const authContext = useContext(AuthContext);
    const [message, setMessage] = useState({});
    const context = useContext(MessageContext);
    const messageId = props.computedMatch.params.messageId
    let recipientsColumns = 1
    const { loading, data: messageData } = useQuery(GET_MESSAGE, {
        variables: { id: messageId }
    });
    useEffect(() => {
        if (messageData) {
            setMessage(messageData.message);
        }
    }, [messageData, message, context]);
    if (message.individualClients) {

        recipientsColumns = [!!message.individualClients.length, !!message.corporateClients.length, !!message.contactPersons.length].filter(Boolean).length
    }
    function messageDetails() {
        return (
            <Container>

                {loading ? <Loader active /> : <Container as={Segment}>

                    {message.id &&
                        <Grid container columns={[!!message.sms, !!message.emailBody].filter(Boolean).length} divided relaxed stackable>
                            {message.sms && <Grid.Column>
                                <Segment><Header as='h3'>Message details</Header></Segment>
                                <Item.Group>
                                    <Item>

                                        <Item.Content>
                                            <Divider horizontal>SMS</Divider>
                                            <Item.Description>
                                                <b>Message: </b><span className='price'>{message.sms}</span><br /><br />
                                                <b>Sent At: </b><span className='price'>{message.sentAt ? moment(message.sentAt).format('DD/MM/YYYY, HH:mm:ss') : moment(message.createdAt).format('DD/MM/YYYY, HH:mm:ss')}</span><br />
                                            </Item.Description>
                                        </Item.Content>
                                    </Item>
                                </Item.Group>

                            </Grid.Column>}
                            {message.emailSubject && <Grid.Column>
                                <Segment><Header as='h3'>Email</Header></Segment>
                                <Item.Group>
                                    <Item>

                                        <Item.Content>
                                            <Item.Description>
                                                <b>Subject: </b><span className='price'>{message.emailSubject}</span><br /> <br />
                                                <b>Body: </b><span className='price'><div dangerouslySetInnerHTML={{ __html: message.emailBody }} /></span><br />
                                                <b>Sent At: </b><span className='price'>{message.sentAt ? moment(message.sentAt).format('DD/MM/YYYY, HH:mm:ss') : moment(message.createdAt).format('DD/MM/YYYY, HH:mm:ss')}</span><br />
                                            </Item.Description>
                                        </Item.Content>
                                    </Item>
                                </Item.Group>
                            </Grid.Column>}
                        </Grid>}
                </Container>}
                <Divider horizontal>Message Recipients</Divider>

                {message.id &&

                    <Grid container columns={recipientsColumns} divided relaxed stackable>

                        {!!message.individualClients.length && <Grid.Column>
                            <Segment><Header as='h3'>Individual Clients</Header></Segment>
                            <Item.Group>
                                <Item>

                                    <Item.Content>
                                        <Item.Description>
                                            {message.individualClients.map((client, key) => (
                                                <Link key={key} to={`/staff/dashboard/clients/profile/${client.id}`}>
                                                    <span style={{ fontSize: ".9em" }}>{key + 1}. <span className='price'>{client.firstName} {client.lastName} - [{client.email}]</span><br /></span>
                                                </Link>
                                            ))}
                                        </Item.Description>
                                    </Item.Content>

                                </Item>

                            </Item.Group>
                        </Grid.Column>}
                        {!!message.contactPersons.length && <Grid.Column>
                            <Segment><Header as='h3'>Contact Persons</Header></Segment>
                            <Item.Group>
                                <Item>

                                    <Item.Content>
                                        <Item.Description>
                                            {message.contactPersons.map((client, key) => (
                                                <Link key={key} to={`/staff/dashboard/contact-person/profile/${client.id}`}>
                                                    <span style={{ fontSize: ".9em" }}>{key + 1}. <span className='price'>{client.name} - [{client.email}]</span><br /></span>
                                                </Link>
                                            ))}
                                        </Item.Description>
                                    </Item.Content>

                                </Item>
                            </Item.Group>
                        </Grid.Column>}
                        {!!message.corporateClients.length && <Grid.Column>
                            <Segment><Header as='h3'>Corporate Clients</Header></Segment>
                            <Item.Group>
                                <Item>

                                    <Item.Content>
                                        <Item.Description>
                                            {message.corporateClients.map((client, key) => (
                                                <Link key={key} to={`/staff/dashboard/contact-person/profile/${client.id}`}>
                                                    <span style={{ fontSize: ".9em" }}>{key + 1}. <span className='price'>{client.name}</span><br /></span>
                                                </Link>
                                            ))}
                                        </Item.Description>
                                    </Item.Content>

                                </Item>
                            </Item.Group>
                        </Grid.Column>}
                    </Grid>}


            </Container>
        )
    }


    const panes = [
        {
            menuItem: (
                <Menu.Item key='Message'>
                    Message Details
                </Menu.Item>
            ),
            render: () => {
                return (
                    <Tab.Pane>
                        {messageDetails()}

                    </Tab.Pane>
                )
            },
        }
    ]

    return (
        <Container>
            <Grid container columns={1} padded>
                <Grid.Column>
                    <div className="content-wrapper">
                        <Header as='h2'>
                            <Icon name='file' />
                            <Header.Content>
                                <a href="/staff/dashboard/overview">Overview</a> {'>'} <a href="/staff/dashboard/crm">CRM</a> {'>'} <a href="/staff/dashboard/crm/messages">Messages</a> {'>'} Message Details
                                <Header.Subheader>
                                    Hey there {authContext.user.username}, find a list of motor policies under General Insurance below
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </div>
                </Grid.Column>
            </Grid>



            <Grid container padded>
                <Grid.Column>
                    <Tab panes={panes} />
                </Grid.Column>
            </Grid>

        </Container>
    )
}
