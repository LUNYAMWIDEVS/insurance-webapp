import React from 'react';
import {
  Grid,
  Card,
  Container,
  Header,
  Icon
} from 'semantic-ui-react';

import '../root.scss';

export default function GeneralPolicies() {
  return (
    <div className='app-container'>
      <Container>

        <Header as='h2'>
          <Icon name='folder' />
          <Header.Content>
            <a href="/staff/dashboard/overview">Overview</a> {'>'} <a href="/staff/dashboard/policies">Policy Classes</a> {'>'} General
            <Header.Subheader>Please select a policy to proceed</Header.Subheader>
          </Header.Content>
        </Header>

        <Grid columns={3}>

          <Grid.Row>
            <Grid.Column>
              <Card color="black" href='/staff/dashboard/policies/general/motor'>
                <Card.Content>
                  <Card.Header>Motor Policy {'>'}</Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    8 Policies Found
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="teal">
                <Card.Content>
                  <Card.Header>WIBA Policy {'>'} </Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    No Policies Found

                 </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="violet">
                <Card.Content>
                  <Card.Header>WIBA Plus Policy {'>'}</Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    No Policies Found

                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Card color="blue">
                <Card.Content>
                  <Card.Header>Domestic Package Policy {'>'}</Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    No Policies Found

                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="blue">
                <Card.Content>
                  <Card.Header>Fire Policy {'>'}</Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    No Policies Found

                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="brown">
                <Card.Content>
                  <Card.Header>Burglary Policy{'>'}</Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    No Policies Found

                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Card color="pink">
                <Card.Content>
                  <Card.Header>Travel Policy {'>'}</Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    No Policies Found

                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="black">
                <Card.Content>
                  <Card.Header>Personal Accident Policy {'>'}</Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    No Policies Found

                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="red">
                <Card.Content>
                  <Card.Header>Professional Indemnity Policy{'>'}</Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    No Policies Found

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