import React, { useContext } from 'react';
import { Segment, Image, Grid, Label, Container, Header, Icon, List } from 'semantic-ui-react';
import moment from 'moment';
import { AuthContext } from '../../context/auth';
import { Link } from 'react-router-dom';

export default function Profile({ user, isClient, isContactPerson }) {
  const context = useContext(AuthContext);
  return (
    <Container>
      <Grid container columns={1} padded>
        <Grid.Column>
          <div className="content-wrapper">
            <Header as='h2'>
              <Icon name='file' />
              <Header.Content>
                <a href={isClient ? "/staff/dashboard/client-records" : isContactPerson ? "/staff/dashboard/contact-person-records" : "/admin/dashboard"}>{isClient ? "Client" : isContactPerson ? "Contact Person" : "Staff"} Records</a> {'>'} {isClient ? "Client" : isContactPerson ? "Contact Person" : "Staff"} Details
                                <Header.Subheader>
                  Hey there {context.user.username},
                                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>

      </Grid>
      <Grid>
        {user && <Grid celled container stackable>
          <Grid.Row columns={1}>
            <Grid.Column>
              <Image className="ui centered image" src={user.image || "https://res.cloudinary.com/dsw3onksq/image/upload/v1607329111/fileuser-avatar-2png-wikimedia-commons-user-avatar-png-450_450_kuzijz.png"} circular size="tiny" />

            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Segment>
                <Label as='a' tag>Name: </Label> {user.name ? user.name : user.firstName + " " + user.lastName}
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Label as='a' tag>Email: </Label> {user.email}
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Segment>
                <Label as='a' tag>Phone Number: </Label> {user.phoneNumber}
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Label as='a' tag>Join Date: </Label> {moment(user.createdAt).format('ddd, MMM Do YYYY')}
              </Segment>
            </Grid.Column>
          </Grid.Row>
          {isContactPerson &&
            <Grid.Row columns={2}>
              <Grid.Column>
                <Segment>
                  <Label as='a' tag>Position: </Label> {user.position}
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment>
                  <Label as='a' tag>service Line: </Label> {user.serviceLine}
                </Segment>
              </Grid.Column>
            </Grid.Row>}
          {isClient &&
            <Grid.Row columns={2}>
              <Grid.Column>
                <Segment>
                  <Label as='a' tag>Occupation: </Label> {user.occupation}
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment>
                              <Label as='a' tag>Residence: </Label> {user.location ? user.location : user.town}
                </Segment>
              </Grid.Column>
            </Grid.Row>}
          {isClient &&
            <Grid.Row columns={2}>
              <Grid.Column>
                <Segment>
                  <Label as='a' tag>ID Number: </Label> {user.idNumber}
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment>
                  <Label as='a' tag>KRA pin: </Label> {user.kraPin}
                </Segment>
              </Grid.Column>
            </Grid.Row>}
          {isClient || isContactPerson &&
            <Grid.Row columns={2}>
              <Grid.Column>
                <Segment>
                  <Label as='a' tag>DOB: </Label> {moment(user.dateOfBirth).format('ddd, MMM Do YYYY')}
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment>
                  <Label as='a' tag>Gender: </Label> {user.gender}
                </Segment>
              </Grid.Column>
            </Grid.Row>}
          {isClient &&
            <Grid.Row columns={2}>
              <Grid.Column>
                <Segment>
                  <Label as='a' tag>Postal Address: </Label> {user.postalAddress || "None"}
                </Segment>
              </Grid.Column>
              {user.clientNumber && <Grid.Column>
                <Segment>
                  <Label as='a' tag>Client Number: </Label> {user.clientNumber || "None"}
                </Segment>
              </Grid.Column>}
            </Grid.Row>}
          {isContactPerson &&
            <Grid.Row columns={2}>
              <Grid.Column>
                <Segment>
                  <Label as='a' tag><Icon name='facebook' />Facebook Account: </Label> {user.facebookAccount}
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment>
                  <Label as='a' tag><Icon name='twitter' />Twitter Account: </Label> {user.twitterAccount}
                </Segment>
              </Grid.Column>
            </Grid.Row>}
          {isContactPerson && <Grid.Row columns={2}>
            <Grid.Column>
              <Segment>
                <Label as='a' tag><Icon name='instagram' />Instagram Account: </Label> {user.instagramAccount}
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Label as='a' tag><Icon name='linkedin' />LinkedIn Account: </Label> {user.linkedinAccount}
              </Segment>
            </Grid.Column>
          </Grid.Row>}
          {isContactPerson && user.client && <Grid.Row columns={1}>
            <Grid.Column>
              <Segment>
                <Label as='a' tag><Icon name='instagram' />Corporate Client: </Label> <Link to={`/staff/dashboard/corporate-client/profile/${user.client.id}`}>{user.client.name}</Link>
              </Segment>
            </Grid.Column>

          </Grid.Row>}
          {user.contactPersons && !!user.contactPersons.length && <Grid.Column width={16}>
            <Segment><Label as='a' tag>Contact Person(s)</Label>
              <List divided relaxed>
                {user.contactPersons.map((contact, key) => (
                  <List.Item key={key}>
                    <List.Icon name='user' size='large' verticalAlign='middle' />
                    <List.Content>
                      <List.Header>
                        <Link key={key} to={`/staff/dashboard/contact-person/profile/${contact.id}`}>
                          <span style={{ fontSize: ".9em" }}><span className='price'>{contact.name}</span><br /></span>
                        </Link>
                      </List.Header>
                      <List.Description as='a'>{contact.email}</List.Description>
                    </List.Content>
                  </List.Item>))}
              </List>
            </Segment>
          </Grid.Column>}
          <Grid.Row columns={2}>
            {user.corporateClients && !!user.corporateClients.length && <Grid.Column>
              <Segment><Label as='a' tag>Corporate Client(s)</Label>
                <List divided relaxed>
                  {user.corporateClients.map((client, key) => (
                    <List.Item key={key}>
                      <List.Icon name='briefcase' size='large' verticalAlign='middle' />
                      <List.Content>
                        <List.Header>
                          <Link key={key} to={`/staff/dashboard/corporate-client/profile/${client.id}`}>
                            <span style={{ fontSize: ".9em" }}><span className='price'>{client.name}</span><br /></span>
                          </Link>
                        </List.Header>
                        <List.Description as='a'>{client.email}</List.Description>
                      </List.Content>
                    </List.Item>))}
                </List>
              </Segment>
            </Grid.Column>}
            <Grid.Column>
              {user.individualClients && !!user.individualClients.length && <Segment>
                <Label as='a' tag>Individual Client(s)</Label>
                <List divided relaxed>
                  {user.individualClients.map((client, key) => (
                    <List.Item key={key}>
                      <List.Icon name='user' size='large' verticalAlign='middle' />
                      <List.Content>
                        <List.Header>
                          <Link key={key} to={`/staff/dashboard/clients/profile/${client.id}`}>
                            <span style={{ fontSize: ".9em" }}><span className='price'>{client.firstName} {client.surname} {client.lastName}</span><br /></span>
                          </Link>
                        </List.Header>
                        <List.Description as='a'>{client.email}</List.Description>
                      </List.Content>
                    </List.Item>))}
                </List>
              </Segment>}
            </Grid.Column>
          </Grid.Row>
        </Grid>}
      </Grid>

    </Container >
  )
}
