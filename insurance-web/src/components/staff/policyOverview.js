import React from 'react';
import {
  Grid,
  Card,
  Container,
  Header,
  Icon
} from 'semantic-ui-react';

import '../root.scss';

export default function PolicyOverview() {
  return (
    <div className='app-container'>
      <Container>

        <Header as='h2'>
          <Icon name='folder' />
          <Header.Content>
            <a href="/staff/dashboard/overview">Overview</a> {'>'} Policy Classes
            <Header.Subheader>Please select an option below to proceed</Header.Subheader>
          </Header.Content>
        </Header>

        <Grid columns={3}>

          <Grid.Row>
            <Grid.Column>
              <Card color="black" href='/staff/dashboard/policies/general'>
                <Card.Content>
                  <Card.Header>General Insurance {'>'}</Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    9 Policy Classes Found Under General
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="teal">
                <Card.Content>
                  <Card.Header>Life Insurance {'>'} </Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    No Policies Found Under Life

                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="violet">
                <Card.Content>
                  <Card.Header>Medical Insurance {'>'}</Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    No Policies Found Under Medical

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