import React from 'react';
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
    Pagination,
    Image
} from 'semantic-ui-react';
import '../root.scss';

export default function GeneralInsurance(props) {
    function wibaList(){
        return(
        <Grid container columns={5}>
            <Grid.Row>
                <Grid.Column>
                <Header as="h4">Client Name</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Policy No.</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Insurance Company</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Renewal Date</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Premium</Header>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <span>{'1.  '}</span>
                    <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' avatar />
                    <span>Benard Ndege</span>
                </Grid.Column>
                <Grid.Column>
                HQ/1100/2018/03/000085
                </Grid.Column>
                <Grid.Column>
                UAP Insurance
                </Grid.Column>
                <Grid.Column>
                13/2/2021
                </Grid.Column>
                <Grid.Column>
                KSH 14, 999
                </Grid.Column>
            </Grid.Row>
        </Grid>
        )
    }

    function travelList(){
        return(
        <Grid container columns={5}>
            <Grid.Row>
                <Grid.Column>
                <Header as="h4">Client Name</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Policy No.</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Insurance Company</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Renewal Date</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Premium</Header>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <span>{'1.  '}</span>
                    <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' avatar />
                    <span>Roseline Pendo</span>
                </Grid.Column>
                <Grid.Column>
                HQ/1100/2018/03/000085
                </Grid.Column>
                <Grid.Column>
                UAP Insurance
                </Grid.Column>
                <Grid.Column>
                13/2/2021
                </Grid.Column>
                <Grid.Column>
                KSH 14, 999
                </Grid.Column>
            </Grid.Row>
        </Grid>
        )
    }

    function proIndemnityList(){
        return(
        <Grid container columns={5}>
            <Grid.Row>
                <Grid.Column>
                <Header as="h4">Client Name</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Policy No.</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Insurance Company</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Renewal Date</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Premium</Header>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <span>{'1.  '}</span>
                    <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' avatar />
                    <span>John S. Juma</span>
                </Grid.Column>
                <Grid.Column>
                HQ/1100/2018/03/000085
                </Grid.Column>
                <Grid.Column>
                UAP Insurance
                </Grid.Column>
                <Grid.Column>
                13/2/2021
                </Grid.Column>
                <Grid.Column>
                KSH 14, 999
                </Grid.Column>
            </Grid.Row>
        </Grid>
        )
    }

    function personalAccidentList(){
        return(
        <Grid container columns={5}>
            <Grid.Row>
                <Grid.Column>
                <Header as="h4">Client Name</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Policy No.</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Insurance Company</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Renewal Date</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Premium</Header>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <span>{'1.  '}</span>
                    <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' avatar />
                    <span>Salima Nancy Juma</span>
                </Grid.Column>
                <Grid.Column>
                HQ/1100/2018/03/000085
                </Grid.Column>
                <Grid.Column>
                UAP Insurance
                </Grid.Column>
                <Grid.Column>
                13/2/2021
                </Grid.Column>
                <Grid.Column>
                KSH 14, 999
                </Grid.Column>
            </Grid.Row>
        </Grid>
        )
    }

    function motorList(){
        return(
        <Grid container columns={5}>
            <Grid.Row>
                <Grid.Column>
                <Header as="h4">Client Name</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Policy No.</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Insurance Company</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Renewal Date</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Premium</Header>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <span>{'1.  '}</span>
                    <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' avatar />
                    <span>Caroline Waridi</span>
                </Grid.Column>
                <Grid.Column>
                HQ/1100/2018/03/000085
                </Grid.Column>
                <Grid.Column>
                UAP Insurance
                </Grid.Column>
                <Grid.Column>
                13/2/2021
                </Grid.Column>
                <Grid.Column>
                KSH 14, 999
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <span>{'2.  '}</span>
                    <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' avatar />
                    <span>Caroline Waridi</span>
                </Grid.Column>
                <Grid.Column>
                HQ/1100/2018/03/000085
                </Grid.Column>
                <Grid.Column>
                Britam Insurance
                </Grid.Column>
                <Grid.Column>
                13/2/2021
                </Grid.Column>
                <Grid.Column>
                KSH 14, 999
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <span>{'3.  '}</span>
                    <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' avatar />
                    <span>Caroline Waridi</span>
                </Grid.Column>
                <Grid.Column>
                HQ/1100/2018/03/000085
                </Grid.Column>
                <Grid.Column>
                CIC Insurance
                </Grid.Column>
                <Grid.Column>
                13/2/2021
                </Grid.Column>
                <Grid.Column>
                KSH 14, 999
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <span>{'4.  '}</span>
                    <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' avatar />
                    <span>Caroline Waridi</span>
                </Grid.Column>
                <Grid.Column>
                HQ/1100/2018/03/000085
                </Grid.Column>
                <Grid.Column>
                UAP Insurance
                </Grid.Column>
                <Grid.Column>
                13/2/2021
                </Grid.Column>
                <Grid.Column>
                KSH 14, 999
                </Grid.Column>
            </Grid.Row>
        </Grid>
        )
    }

    function fireList(){
        return(
        <Grid container columns={5}>
            <Grid.Row>
                <Grid.Column>
                <Header as="h4">Client Name</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Policy No.</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Insurance Company</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Renewal Date</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Premium</Header>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <span>{'1.  '}</span>
                    <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' avatar />
                    <span>Fahari Collins Maitha</span>
                </Grid.Column>
                <Grid.Column>
                HQ/1100/2018/03/000085
                </Grid.Column>
                <Grid.Column>
                UAP Insurance
                </Grid.Column>
                <Grid.Column>
                13/2/2021
                </Grid.Column>
                <Grid.Column>
                KSH 14, 999
                </Grid.Column>
            </Grid.Row>
        </Grid>
        )
    }

    function domesticPackageList(){
        return(
        <Grid container columns={5}>
            <Grid.Row>
                <Grid.Column>
                <Header as="h4">Client Name</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Policy No.</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Insurance Company</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Renewal Date</Header>
                </Grid.Column>
                <Grid.Column>
                <Header as="h4">Premium</Header>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <span>{'1.  '}</span>
                    <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' avatar />
                    <span>Michael Kazi</span>
                </Grid.Column>
                <Grid.Column>
                HQ/1100/2018/03/000085
                </Grid.Column>
                <Grid.Column>
                UAP Insurance
                </Grid.Column>
                <Grid.Column>
                13/2/2021
                </Grid.Column>
                <Grid.Column>
                KSH 14, 999
                </Grid.Column>
            </Grid.Row>
        </Grid>
        )
    }
    const panes = [
        {
            menuItem: (
                <Menu.Item key='wiba'>
                  WIBA<Label>{1}</Label>
                </Menu.Item>
              ),
            render: () => {
                return(
                    <Tab.Pane>
                        {wibaList()}
                        <br/>
                        <Pagination
                        defaultActivePage={1}
                        firstItem={null}
                        lastItem={null}
                        pointing
                        secondary
                        totalPages={1}
                        />
                    </Tab.Pane>
                )
            },
        },
        {
          menuItem: (
            <Menu.Item key='travel'>
              Travel<Label>1</Label>
            </Menu.Item>
          ),
          render: () => {
            return(
                <Tab.Pane>
                    {travelList()}
                    <br/>
                    <Pagination
                    defaultActivePage={1}
                    firstItem={null}
                    lastItem={null}
                    pointing
                    secondary
                    totalPages={3}
                    />
                </Tab.Pane>
            )
        },
        },
        {
            menuItem: (
              <Menu.Item key='prof-ind'>
                Pro Indemnity<Label>1</Label>
              </Menu.Item>
            ),
            render: () => {
              return(
                  <Tab.Pane>
                      {proIndemnityList()}
                      <br/>
                      <Pagination
                      defaultActivePage={1}
                      firstItem={null}
                      lastItem={null}
                      pointing
                      secondary
                      totalPages={3}
                      />
                  </Tab.Pane>
              )
          },
          },
          {
            menuItem: (
              <Menu.Item key='personal-acc'>
                Personal Accident<Label>1</Label>
              </Menu.Item>
            ),
            render: () => {
              return(
                  <Tab.Pane>
                      {personalAccidentList()}
                      <br/>
                      <Pagination
                      defaultActivePage={1}
                      firstItem={null}
                      lastItem={null}
                      pointing
                      secondary
                      totalPages={3}
                      />
                  </Tab.Pane>
              )
          },
          },
          {
            menuItem: (
              <Menu.Item key='motor'>
                Motor<Label>4</Label>
              </Menu.Item>
            ),
            render: () => {
              return(
                  <Tab.Pane>
                      {motorList()}
                      <br/>
                      <Pagination
                      defaultActivePage={1}
                      firstItem={null}
                      lastItem={null}
                      pointing
                      secondary
                      totalPages={3}
                      />
                  </Tab.Pane>
              )
          },
          },
          {
            menuItem: (
              <Menu.Item key='fire'>
                Fire<Label>1</Label>
              </Menu.Item>
            ),
            render: () => {
              return(
                  <Tab.Pane>
                      {fireList()}
                      <br/>
                      <Pagination
                      defaultActivePage={1}
                      firstItem={null}
                      lastItem={null}
                      pointing
                      secondary
                      totalPages={3}
                      />
                  </Tab.Pane>
              )
          },
          },
          {
            menuItem: (
              <Menu.Item key='domestic-pack'>
                Domestic package<Label>1</Label>
              </Menu.Item>
            ),
            render: () => {
              return(
                  <Tab.Pane>
                      {domesticPackageList()}
                      <br/>
                      <Pagination
                      defaultActivePage={1}
                      firstItem={null}
                      lastItem={null}
                      pointing
                      secondary
                      totalPages={3}
                      />
                  </Tab.Pane>
              )
          },
          },
      ]

    return(
        <Container>
        <Grid container columns={2} padded>
        <Grid.Column>
        <div className="content-wrapper">
            <Header as='h2'>
                <Icon name='file' />
                <Header.Content>
                <a href="/staff/dashboard/policies">Policies</a> {'>'} General
                <Header.Subheader>
                Hey there {'User'}, find a list of policies under General Insurance below
                </Header.Subheader>
                </Header.Content>
            </Header>
        </div>
        </Grid.Column>

        <Grid.Column width={3} className="clear-left">
        <Button basic href="/staff/dashboard/add-new-motor-policy">+ add new policy</Button>
    </Grid.Column>
        </Grid>

        <Grid container columns={1} padded>
            <Grid.Column>
            <Form>
        <Form.Group>
          <Form.Input
            placeholder='Name, Policy number...'
            name='name'
          />
          <Form.Button icon size={'medium'}>
            <Icon name="search"/>
            Find Policy
          </Form.Button>
        </Form.Group>
      </Form>
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
