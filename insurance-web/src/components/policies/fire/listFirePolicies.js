import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
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
    Loader,
    Table
} from 'semantic-ui-react';
import { useLazyQuery } from '@apollo/react-hooks';
import { MotorPolicyContext } from '../../../context/policy/motor';
import { FETCH_MOTOR_POLICIES } from '../queries'
import { AuthContext } from '../../../context/auth';

export default function MotorPolicies() {

    const authContext = useContext(AuthContext);
    const [motorPolicies, setMotorPolicies] = useState({});
    const [fetched, setFetched] = useState(false);
    const [pagination, setPagination] = useState({
        limit: 200,
        page: 1,
        search: ""
    });

    const context = useContext(MotorPolicyContext);

    const [fetchPolicies, { data: motorPoliciesData }] = useLazyQuery(FETCH_MOTOR_POLICIES, {
        variables: pagination
    });
    useEffect(() => {
        if (motorPoliciesData) {
            setMotorPolicies(motorPoliciesData.motorPolicies);
            setFetched(true);
        }
    }, [motorPoliciesData, motorPolicies, context]);
    useEffect(() => {
        if (!fetched) {
            fetchPolicies()
        }
    })
    const handleOnPageChange = (e, data) => {
        e.preventDefault()
        setPagination({ ...pagination, page: data.activePage })
    }
    const handleOnSearch = (e) => {
        e.preventDefault()
        setPagination({ ...pagination, search: e.target.value })

    }
    function motorList() {
        return (
            <Table id="multipleReports">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Client Name</Table.HeaderCell>
                        <Table.HeaderCell>Policy No.</Table.HeaderCell>
                        <Table.HeaderCell>Debit Note No.</Table.HeaderCell>
                        <Table.HeaderCell>Insurance Company</Table.HeaderCell>
                        <Table.HeaderCell>Start Date</Table.HeaderCell>
                        <Table.HeaderCell>End Date</Table.HeaderCell>
                        <Table.HeaderCell>Premium (Ksh)</Table.HeaderCell>
                        <Table.HeaderCell>Go To</Table.HeaderCell>                       
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                {motorPolicies.items && motorPolicies.items.map((policy, index)=>
                    <Table.Row>
                        <Table.Cell>
                            {policy.individualClient && <span style={{ "fontSize": ".9rem" }}>{policy.individualClient.firstName} {policy.individualClient.lastName}</span>}
                            {policy.corporateClient && <span style={{ "fontSize": ".9rem" }}>{policy.corporateClient.name}</span>}
                        </Table.Cell>
                        <Table.Cell>{policy.policyNo.length > 13 ? policy.policyNo.substring(0, 13) + "..." : policy.policyNo}</Table.Cell>
                        <Table.Cell>{policy.debitNoteNo.length > 13 ? policy.debitNoteNo.substring(0, 13) + "..." : policy.debitNoteNo}</Table.Cell>
                        <Table.Cell><span style={{ "fontSize": ".9rem" }}>{policy.insuranceCompany.name}</span></Table.Cell>
                        <Table.Cell>{policy.startDate}</Table.Cell>
                        <Table.Cell>{policy.endDate}</Table.Cell>
                        <Table.Cell>{policy.premiums.totalPremiums.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Table.Cell>
                        <Table.Cell>
                            <Link to={`/staff/dashboard/policies/general/motor/details/${policy.id}`}>
                                <Button icon >
                                    <Icon name='external alternate' />
                                </Button>
                            </Link>
                        </Table.Cell>
                    </Table.Row>
                )}
                </Table.Body>
                
                
            </Table>
            
        )
    }

    const panes = [
        {
            menuItem: (
                <Menu.Item key='motor' disabled={true}>
                    Motor<Label>{motorPolicies && motorPolicies.count}</Label>
                </Menu.Item>
            ),
            render: () => {
                return (
                    <Tab.Pane>
                        {motorList()}
                        <br />
                        {motorPolicies.pages ?
                            <Pagination
                                defaultActivePage={motorPolicies.page}
                                firstItem={null}
                                lastItem={null}
                                pointing
                                secondary
                                onPageChange={handleOnPageChange}
                                totalPages={motorPolicies.pages}
                            /> : ""}
                        <ReactHTMLTableToExcel
                            table="multipleReports"
                            filename="multipleReports"
                            sheet="Sheet 1"
                            buttonText="Download Report"
                        />
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
                                <a href="/staff/dashboard/policies">Policies</a> {'>'} <a href="/staff/dashboard/policies/general">General</a> {'>'} Motor
                                <Header.Subheader>
                                    Hey there {authContext.user.username}, find a list of motor policies under General Insurance below
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </div>
                </Grid.Column>

                <Grid.Column width={3} className="clear-left">
                    
                    <Button href="/staff/dashboard/add-new-motor-policy" color='blue'>+ add new policy</Button>
                </Grid.Column>
            </Grid>

            <Grid container columns={1} padded>
                <Grid.Column>
                    <Form>
                        <Form.Group>
                            <Form.Input
                                placeholder='Name, Policy number...'
                                name='name'
                                onChange={handleOnSearch}
                            />
                            <Form.Button icon size={'medium'} onClick={(e) => { e.preventDefault(); fetchPolicies() }}>
                                <Icon name="search" />
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
