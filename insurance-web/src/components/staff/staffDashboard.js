import React from 'react';
import {
  Grid,
  Card,
  Container,
  Header,
  Icon
} from 'semantic-ui-react';

import '../root.scss';

export default function StaffDashBoard(props) {
  return (
    <div className='app-container'>
      <Container>

        <Header as='h2'>
          <Icon name='settings' />
          <Header.Content>
            Overview
            <Header.Subheader>Please select an option below to proceed</Header.Subheader>
          </Header.Content>
        </Header>

        <Grid columns={3}>

          <Grid.Row>
            <Grid.Column>
              <Card color="black" href='/staff/dashboard/crm'>
                <Card.Content>
                  <Card.Header>CRM {'>'} </Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    Administration of Individual Clients, Corporate Clients, and Contact Persons
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            {/* <Grid.Column>
              <Card color="teal">
                <Card.Content>
                  <Card.Header>Premium Records {'>'} </Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    Create, Retrieve, Update or Delete Premium Records
                   </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column> */}
            <Grid.Column>
              <Card color="violet" href='/staff/dashboard/policies/general/motor'>
                <Card.Content>
                  <Card.Header>Policy Records  {'>'}</Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    Create, Retrieve, Update or Delete Policy Records
                   </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>

            <Grid.Column>
              <Card color="olive" href="/staff/dashboard/insurance-companies">
                <Card.Content>
                  <Card.Header>Insurance Company Listing {'>'}</Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    Create, Retrieve, Update or Delete Insurance company listings
                   </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            {/* <Grid.Column>
              <Card color="olive" href="/staff/dashboard/insurance-companies">
                <Card.Content>
                  <Card.Header>Insurance Company Listing {'>'}</Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    Create, Retrieve, Update or Delete Insurance company listings
                   </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column> */}
            {/* <Grid.Column>
              <Card color="orange">
                <Card.Content>
                  <Card.Header>Insurance Classes {'>'}</Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    Create, Retrieve, Update or Delete Insurance Classes
                   </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column> */}

            {/* <Grid.Column>
              <Card color="green">
                <Card.Content>
                  <Card.Header>Policy Quotes {'>'} </Card.Header>
                  <Card.Meta></Card.Meta>
                  <Card.Description>
                    Create, Retrieve, Update, Resolve or Delete Policy Quotes

                   </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column> */}


          </Grid.Row>
        </Grid>

      </Container>
    </div>

  )
}

