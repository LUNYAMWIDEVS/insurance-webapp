import React, { useState, useContext, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import {
    Grid,
    // Button,
    Container,
    Divider,
    Header,
    Icon,
    Segment,
    Item,
    Menu,
    Tab,
    Loader,
    Button
} from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';
import { MotorPolicyContext } from '../../../context/policy/motor';
import { GET_MOTOR_POLICY } from '../queries'
import { AuthContext } from '../../../context/auth';
import { Link } from 'react-router-dom';

export default function MotorPolicy({ props }) {
    const authContext = useContext(AuthContext);
    const [motorPolicy, setMotorPolicy] = useState({});
    const context = useContext(MotorPolicyContext);
    const policyId = props.computedMatch.params.policyId

    const { loading, data: motorPolicyData } = useQuery(GET_MOTOR_POLICY, {
        variables: { id: policyId }
    });
    useEffect(() => {
        if (motorPolicyData) {
            setMotorPolicy(motorPolicyData.motorPolicy);
        }
    }, [motorPolicyData, motorPolicy, context]);
    function motorPolicyDetails() {
        return (
            <Container>

                {loading ? <Loader active /> : <Container>

                    {motorPolicy.id &&
                        <Grid container columns={2} divided relaxed stackable>
                            <Grid.Column>
                                <Segment><Header as='h3'>Client details</Header></Segment>
                                <Item.Group>
                                    <Item>

                                        <Item.Content>
                                            <Divider horizontal>Basic Information</Divider>
                                            {motorPolicy.individualClient && <Item.Description>
                                                <b>Name: </b><span className='price'>{motorPolicy.individualClient.firstName} {motorPolicy.individualClient.lastName} {motorPolicy.individualClient.surname}</span><br />
                                                <b>Email: </b><span className='price'>{motorPolicy.individualClient.email}</span><br />
                                                <b>Phone Number: </b><span className='price'>{motorPolicy.individualClient.phoneNumber}</span><br />
                                                <b>ID Number: </b><span className='price'>{motorPolicy.individualClient.idNumber}</span><br />
                                                <b>kra Pin: </b><span className='price'>{motorPolicy.individualClient.kraPin}</span><br />
                                            </Item.Description>}
                                            {motorPolicy.corporateClient && <Item.Description>
                                                <b>Name: </b><span className='price'>{motorPolicy.corporateClient.name}</span><br />
                                                <b>Email: </b><span className='price'>{motorPolicy.corporateClient.email}</span><br />
                                                <b>Phone Number: </b><span className='price'>{motorPolicy.corporateClient.phoneNumber}</span><br />
                                                <b>kra Pin: </b><span className='price'>{motorPolicy.corporateClient.kraPin}</span><br />
                                            </Item.Description>}
                                        </Item.Content>
                                    </Item>

                                    <Item>

                                        <Item.Content>
                                            <Divider horizontal>Policy Information</Divider>
                                            <Item.Description>
                                                <b>Policy Number: </b><span className='price'>{motorPolicy.policyNo}</span><br />
                                                <b>Debit Note Number: </b><span className='price'>{motorPolicy.debitNoteNo}</span><br />
                                                <b>Insurance Class: </b><span className='price'>{motorPolicy.insuranceClass}</span><br />
                                                <b>Insurance Company: </b><span className='price'>{motorPolicy.insuranceCompany.name}</span><br />
                                                <b>Transaction Type: </b><span className='price'>{motorPolicy.transactionType}</span><br />
                                                <b>Start Date: </b><span className='price'>{motorPolicy.startDate}</span><br />
                                                <b>End Date: </b><span className='price'>{motorPolicy.endDate}</span><br />
                                                <b>Renewal Date: </b><span className='price'>{motorPolicy.renewalDate || "None"}</span><br />
                                                <b>Transaction Date: </b><span className='price'>{motorPolicy.transactionDate}</span><br />
                                            </Item.Description>
                                        </Item.Content>
                                    </Item>
                                </Item.Group>

                            </Grid.Column>
                            <Grid.Column>
                                <Segment><Header as='h3'>Vehicle details</Header></Segment>
                                <Item.Group>
                                    {motorPolicy.vehicles.map((vehicle, key) => (
                                        <Item key={key}>

                                            <Item.Content>
                                                <Divider horizontal>{motorPolicy.vehicles.length > 1 ? 'Vehicle ' + (+key + 1) + " - " : ""} Basic Information</Divider>
                                                <Item.Description>
                                                    <b>Registration Number: </b><span className='price'>{vehicle.registrationNo} </span><br />
                                                    <b>Year of Manufacture: </b><span className='price'>{vehicle.yearOfManufacture} </span><br />
                                                    <b>Model: </b><span className='price'>{vehicle.model} </span><br />
                                                    <b>Make: </b><span className='price'>{vehicle.make} </span><br />
                                                    <b>Body: </b><span className='price'>{vehicle.body} </span><br />
                                                    <b>Color: </b><span className='price'>{vehicle.color} </span><br />
                                                    <b>CC: </b><span className='price'>{vehicle.cc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br />
                                                    <b>Chassis Number: </b><span className='price'>{vehicle.chassisNo} </span><br />
                                                    <b>Engine Number: </b><span className='price'>{vehicle.engineNo} </span><br />
                                                    <b>Tonnage: </b><span className='price'>{vehicle.tonnage} </span><br />
                                                    <b>Value: </b><span className='price'>Ksh {vehicle.value ? vehicle.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0} </span><br />
                                                </Item.Description>
                                            </Item.Content>
                                        </Item>
                                    ))}
                                    {motorPolicy.vehicles.length > 1 && <Segment><Header as='h3'>Total</Header></Segment>}
                                    {motorPolicy.vehicles.length > 1 && <Item>

                                        <Item.Content>
                                            <Item.Description>
                                                <b>Total Value: </b><span className='price'>Ksh {motorPolicy.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br />
                                            </Item.Description>
                                        </Item.Content>
                                    </Item>}
                                </Item.Group>
                            </Grid.Column>
                        </Grid>}
                    {motorPolicy.remarks &&
                        <Grid container columns={1} divided relaxed stackable>
                            <Grid.Column>
                                <Segment><Header as='h3'>Remarks</Header></Segment>
                                <Item.Group>
                                    <Item>

                                        <Item.Content>
                                            <Item.Description>
                                                <div dangerouslySetInnerHTML={{ __html: motorPolicy.remarks }} />
                                            </Item.Description>
                                        </Item.Content>
                                    </Item>
                                </Item.Group>
                            </Grid.Column>
                        </Grid>}
                </Container>}
            </Container>
        )
    }
    function premiumDetails() {
        return (
            <Container>

                {motorPolicy.id &&

                    <Grid container columns={motorPolicy.additionalPremiums && motorPolicy.additionalBenefits.length ? 3 : !!(motorPolicy.additionalPremiums.length || motorPolicy.additionalBenefits.length) ? 2 : 1} divided relaxed stackable>

                        <Grid.Column>
                            <Segment><Header as='h3'>Basic Premium</Header></Segment>
                            <Item.Group>
                                <Item>

                                    <Item.Content>
                                        <Divider horizontal>Basic Premiums Info</Divider>
                                        <Item.Description>
                                            <b>Premium Type: </b><span className='price'>{motorPolicy.premiumType} </span><br />
                                            <b>Premium Rate: </b><span className='price'>{motorPolicy.commissionRate}% </span><br />
                                            <b>Minimum Premium Amount: </b><span className='price'>Ksh {motorPolicy.minimumPremiumAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br />
                                            <span><b>Amount: </b><span className='price'>Ksh {motorPolicy.premiums.basicPremium.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br /></span>
                                        </Item.Description>
                                    </Item.Content>

                                </Item>

                            </Item.Group>
                        </Grid.Column>

                        {(motorPolicy.additionalBenefits && !!motorPolicy.additionalBenefits.length) && <Grid.Column>
                            <Segment><Header as='h3'>Additional Benefits</Header></Segment>
                            <Item.Group>
                                {motorPolicy.additionalBenefits.map((benefit, i) => (
                                    <Item.Content key={i}>
                                        {motorPolicy.premiums.AdditionalBenefits[i] && <Item>
                                            <Divider horizontal>.{i + 1}.</Divider>
                                            <Item.Description>
                                                <b>Benefit Type: </b><span className='price'>{benefit.label} </span><br />
                                                <b>Commission Rate: </b><span className='price'>{benefit.commissionRate ? benefit.commissionRate + "%" : ""}  </span><br />
                                                {benefit.minimumAmount && <span><b>Minimum Benefit Amount: </b><span className='price'> Ksh {benefit.minimumAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br /></span>}
                                                <span><b>Amount: </b><span className='price'>Ksh {motorPolicy.premiums.AdditionalBenefits[i] ? motorPolicy.premiums.AdditionalBenefits[i].amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""} </span><br /></span>
                                            </Item.Description>
                                        </Item>}
                                    </Item.Content>
                                ))}
                            </Item.Group>
                        </Grid.Column>}
                        {!!motorPolicy.additionalPremiums.length && <Grid.Column>
                            <Segment><Header as='h3'>Additional Levies</Header></Segment>
                            <Item.Group>
                                {motorPolicy.additionalPremiums.map((premium, i) => (<Item.Content key={i}>
                                    <Item>
                                        <Divider horizontal>.{i + 1}.</Divider>
                                        <Item.Description>
                                            <b>Levy Type: </b><span className='price'>{premium.label} </span><br />
                                            {premium.commissionRate && <span><b>Levy Rate: </b><span className='price'>{premium.commissionRate + "%"}  </span><br /></span>}
                                            <span><b>Amount: </b><span className='price'>Ksh {motorPolicy.premiums.AdditionalPremiums[i].amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br /></span>
                                        </Item.Description>
                                    </Item>
                                </Item.Content>))}
                            </Item.Group>
                        </Grid.Column>}
                    </Grid>}

                {motorPolicy.id &&
                    <div>
                        <br /><br /><Segment><Header as='h3' size="medium" textAlign="center">Policy Premium Totals</Header></Segment>
                        <Grid columns='equal' container divided relaxed stackable>
                            <Grid.Row >
                                <Grid.Column>
                                    <b>Net Premium:</b><span className='price'>Ksh {motorPolicy.premiums.netPremiums.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br />
                                </Grid.Column>
                                <Grid.Column>
                                    <b>Total Levies:</b><span className='price'>Ksh {motorPolicy.premiums.totalLevies.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br />
                                </Grid.Column>
                                <Grid.Column>
                                    <b>Gross Premium:</b><span className='price'>Ksh {motorPolicy.premiums.totalPremiums.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br /><br />
                                </Grid.Column>
                            </Grid.Row>
                            <Divider clearing />
                            <Grid.Row >
                                <Grid.Column>
                                    <b>Gross Commission:</b><span className='price'>Ksh {motorPolicy.premiums.grossCommission.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br />
                                </Grid.Column>
                                <Grid.Column>
                                    <b>Withholding Tax:</b><span className='price'>Ksh {motorPolicy.premiums.withholdingTax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br />
                                </Grid.Column>
                                <Grid.Column>
                                    <b>Net Commission:</b><span className='price'>Ksh {motorPolicy.premiums.netCommission.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br /><br />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>}
            </Container>
        )
    }

    const panes = [
        {
            menuItem: (
                <Menu.Item key='policy'>
                    Motor Policy Details
                </Menu.Item>
            ),
            render: () => {
                return (
                    <Tab.Pane>
                        {motorPolicyDetails()}

                    </Tab.Pane>
                )
            },
        },
        {
            menuItem: (
                <Menu.Item key='premiums'>
                    Premiums Details
                </Menu.Item>
            ),
            render: () => {
                return (
                    <Tab.Pane>
                        {premiumDetails()}

                    </Tab.Pane>
                )
            },
        }
    ]

    return (
        <Container>
            <Grid container columns={2} padded>
                <Grid.Column>
                    <div className="content-wrapper">
                        <Header as='h2'>
                            <Icon name='file' />
                            <Header.Content>
                                <a href="/staff/dashboard/policies">Policies</a> {'>'} <a href="/staff/dashboard/policies/general">General</a> {'>'} <a href="/staff/dashboard/policies/general/motor">Motor</a> {'>'} Policy Details
                                <Header.Subheader>
                                    Hey there {authContext.user.username}, find a list of motor policies under General Insurance below
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </div>
                </Grid.Column>

                <Grid.Column width={3} className="clear-left">
                    {motorPolicy && <Link to={`/staff/dashboard/policies/general/motor/reports/${motorPolicy.id}`}> <Button icon><Icon name='chart line' /> View Report</Button></Link>}
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
