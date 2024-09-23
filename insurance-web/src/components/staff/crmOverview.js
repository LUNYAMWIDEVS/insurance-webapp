import React from 'react';
import {
  Grid,
  Card,
  Container,
  Header,
  Icon
} from 'semantic-ui-react';

import '../root.scss';

export default function CRMOverview() {
  return (
    <div className='app-container'>
      <Container>

        <Header as='h2'>
          <Icon name='folder' />
          <Header.Content>
            <a href="/staff/dashboard/overview">Overview</a> {'>'} CRM
            <Header.Subheader>Please select an option below to proceed</Header.Subheader>
          </Header.Content>
        </Header>

        <Grid columns={3}>

          <Grid.Row>
            <Grid.Column>
              <Card color="black" href='/staff/dashboard/client-records'>
                <Card.Content>
                  <Card.Header>Clients {'>'}</Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    Corporate Clients and Individual Clients
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="teal" href='/staff/dashboard/contact-person-records'>
                <Card.Content>
                  <Card.Header>Contact Persons {'>'} </Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    Contact Persons' details

                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="teal" href='/staff/dashboard/crm/messages'>
                <Card.Content>
                  <Card.Header>Communication {'>'} </Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    Send Emails or Text Messages
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>

        </Grid>
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column>
                <Card color="teal" href='/staff/dashboard/crm/whatsapp-messages'>
                  <Card.Content>
                    <Card.Header>Social Media Integrations {'>'} </Card.Header>
                    <Card.Meta></Card.Meta>
                    <Card.Description>
                      Send Social Media Messages
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
          </Grid.Row>  
        </Grid>
      </Container>
    </div>
  )
}