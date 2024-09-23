import React, { useState, useContext, useEffect } from 'react';
import {
    Grid,
    Button,
    Header,
    Icon,
    Table,
    Menu,
    Tab,
    Loader
} from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';
import { MotorPolicyContext } from '../../../context/policy/motor';
import { GET_MOTOR_POLICY } from '../queries'
import { AuthContext } from '../../../context/auth';
import moment from 'moment';
import ReactExport from "react-export-excel";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function MotorPolicyReport({ props }) {

    const authContext = useContext(AuthContext);
    const [motorPolicy, setMotorPolicy] = useState({});
    const [dataset, setDataset] = useState({ data: [], created: false });
    const policyId = props.computedMatch.params.policyId


    const context = useContext(MotorPolicyContext);

    const { data: motorPolicyData } = useQuery(GET_MOTOR_POLICY, {
        variables: { id: policyId }
    });
    useEffect(() => {
        if (motorPolicyData) {
            setMotorPolicy(motorPolicyData.motorPolicy);
        }
    }, [motorPolicyData, motorPolicy, context]);

    useEffect(() => {
        if (motorPolicy.id && !dataset.created) {
            const data = [
                {
                    clientNumber: motorPolicy.corporateClient ? motorPolicy.corporateClient.clientNumber : motorPolicy.individualClient.clientNumber,
                    clientName: motorPolicy.corporateClient ? motorPolicy.corporateClient.name : motorPolicy.individualClient.firstName + " " + motorPolicy.individualClient.lastName + " " + motorPolicy.individualClient.surname,
                    //postalAddress: motorPolicy.corporateClient ? motorPolicy.corporateClient.postalAddress : motorPolicy.individualClient.postalAddress,
                    location: motorPolicy.corporateClient ? motorPolicy.corporateClient.location : motorPolicy.individualClient.location,
                    occupation: motorPolicy.individualClient ? motorPolicy.individualClient.occupation : "",
                    dateOfBirth: motorPolicy.individualClient ? motorPolicy.individualClient.dateOfBirth : "",
                    idNumber: motorPolicy.individualClient ? motorPolicy.individualClient.idNumber : "",
                    kraPin: motorPolicy.corporateClient ? motorPolicy.corporateClient.kraPin : motorPolicy.individualClient.kraPin,
                    phoneNumber: motorPolicy.corporateClient ? motorPolicy.corporateClient.phoneNumber : motorPolicy.individualClient.phoneNumber,
                    email: motorPolicy.corporateClient ? motorPolicy.corporateClient.email : motorPolicy.individualClient.email,
                    vehicleUse: "transport",
                    insuranceCompany: motorPolicy.insuranceCompany.name,
                    insuranceClass: motorPolicy.insuranceClass,
                    policyNo: motorPolicy.policyNo,
                    registrationNo: motorPolicy.vehicles[0].registrationNo,
                    value: motorPolicy.value,
                    transactionDate: moment(motorPolicy.transactionDate).format('ddd, MMM Do YYYY'),
                    startDate: moment(motorPolicy.startDate).format('ddd, MMM Do YYYY'),
                    endDate: moment(motorPolicy.endDate).format('ddd, MMM Do YYYY'),
                    grossPremium: motorPolicy.premiums.totalPremiums.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    netPremiums: motorPolicy.premiums.netPremiums.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    premiumPaid: 34564,
                    premiumBalance: 6466,
                    grossCommission: motorPolicy.premiums.grossCommission.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    withholdingTax: motorPolicy.premiums.withholdingTax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    netCommission: motorPolicy.premiums.netCommission.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                }
            ]
            setDataset({ data, created: true })
        }
    }, [dataset.created, motorPolicy])
    function policyReport() {
        return (
            <React.Fragment>
                {!motorPolicy.id ? <Loader active />
                    : <Grid style={{ overflowY: 'scroll' }}>
                        <Table celled id="individualReport">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Client Number</Table.HeaderCell>
                                    <Table.HeaderCell>Insured Name</Table.HeaderCell>
                                    {/* <Table.HeaderCell>Address</Table.HeaderCell> */}
                                    <Table.HeaderCell>Location</Table.HeaderCell>
                                    {motorPolicy.individualClient && <Table.HeaderCell>Occupation</Table.HeaderCell>}
                                    {motorPolicy.individualClient && <Table.HeaderCell>Date of Birth</Table.HeaderCell>}
                                    {motorPolicy.individualClient && <Table.HeaderCell>Id Number</Table.HeaderCell>}
                                    <Table.HeaderCell>KRA Pin</Table.HeaderCell>
                                    <Table.HeaderCell>Telephone Number</Table.HeaderCell>
                                    <Table.HeaderCell>Email</Table.HeaderCell>
                                    <Table.HeaderCell>Vehicle Use</Table.HeaderCell>
                                    <Table.HeaderCell>Insurance Company</Table.HeaderCell>
                                    <Table.HeaderCell>Policy Class</Table.HeaderCell>
                                    <Table.HeaderCell>Policy Number</Table.HeaderCell>
                                    <Table.HeaderCell>Vehicle Registration Number</Table.HeaderCell>
                                    <Table.HeaderCell>Sum Insured</Table.HeaderCell>
                                    <Table.HeaderCell>Transaction Date</Table.HeaderCell>
                                    <Table.HeaderCell>Period From</Table.HeaderCell>
                                    <Table.HeaderCell>Period To</Table.HeaderCell>
                                    <Table.HeaderCell>Gross Premium</Table.HeaderCell>
                                    <Table.HeaderCell>Net Premium</Table.HeaderCell>
                                    <Table.HeaderCell>Premium Paid</Table.HeaderCell>
                                    <Table.HeaderCell>Premium Balance</Table.HeaderCell>
                                    <Table.HeaderCell>Gross Commission</Table.HeaderCell>
                                    <Table.HeaderCell>Withholding Tax</Table.HeaderCell>
                                    <Table.HeaderCell>Net Commission</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {motorPolicy.vehicles.map((vehicle, key) => (
                                    <Table.Row key={key}>
                                        <Table.Cell>{motorPolicy.corporateClient ? motorPolicy.corporateClient.clientNumber : motorPolicy.individualClient.clientNumber}</Table.Cell>
                                        <Table.Cell>{motorPolicy.corporateClient ? motorPolicy.corporateClient.name : motorPolicy.individualClient.firstName + " " + motorPolicy.individualClient.lastName + " " + motorPolicy.individualClient.surname}</Table.Cell>
                                        {/* <Table.Cell>{motorPolicy.corporateClient ? motorPolicy.corporateClient.postalAddress : motorPolicy.individualClient.postalAddress}</Table.Cell> */}
                                        <Table.Cell>{motorPolicy.corporateClient ? motorPolicy.corporateClient.town : motorPolicy.individualClient.town}</Table.Cell>
                                        {motorPolicy.individualClient && <Table.Cell>{motorPolicy.individualClient.occupation}</Table.Cell>}
                                        {motorPolicy.individualClient && <Table.Cell>{motorPolicy.individualClient.dateOfBirth}</Table.Cell>}
                                        {motorPolicy.individualClient && <Table.Cell>{motorPolicy.individualClient.idNumber}</Table.Cell>}
                                        <Table.Cell>{motorPolicy.corporateClient ? motorPolicy.corporateClient.kraPin : motorPolicy.individualClient.kraPin}</Table.Cell>
                                        <Table.Cell>{motorPolicy.corporateClient ? motorPolicy.corporateClient.phoneNumber : motorPolicy.individualClient.phoneNumber}</Table.Cell>
                                        <Table.Cell>{motorPolicy.corporateClient ? motorPolicy.corporateClient.email : motorPolicy.individualClient.email}</Table.Cell>
                                        <Table.Cell>{}</Table.Cell>
                                        <Table.Cell>{motorPolicy.insuranceCompany.name}</Table.Cell>
                                        <Table.Cell>{motorPolicy.insuranceClass}</Table.Cell>
                                        <Table.Cell>{motorPolicy.policyNo}</Table.Cell>
                                        <Table.Cell>{vehicle.registrationNo}</Table.Cell>
                                        <Table.Cell>{motorPolicy.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Table.Cell>
                                        <Table.Cell>{moment(motorPolicy.transactionDate).format('ddd, MMM Do YYYY')}</Table.Cell>
                                        <Table.Cell>{moment(motorPolicy.startDate).format('ddd, MMM Do YYYY')}</Table.Cell>
                                        <Table.Cell>{moment(motorPolicy.endDate).format('ddd, MMM Do YYYY')}</Table.Cell>
                                        <Table.Cell>{motorPolicy.premiums.totalPremiums.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Table.Cell>
                                        <Table.Cell>{motorPolicy.premiums.netPremiums.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Table.Cell>
                                        <Table.Cell>{}</Table.Cell>
                                        <Table.Cell>{}</Table.Cell>
                                        <Table.Cell>{motorPolicy.premiums.grossCommission.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Table.Cell>
                                        <Table.Cell>{motorPolicy.premiums.withholdingTax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Table.Cell>
                                        <Table.Cell>{motorPolicy.premiums.netCommission.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Table.Cell>
                                    </Table.Row>))}
                            </Table.Body>


                        </Table></Grid>}
            </React.Fragment>

        )
    }

    const panes = [
        {
            menuItem: (
                <Menu.Item key='motor' disabled={true}>
                    Motor
                </Menu.Item>
            ),
            render: () => {
                return (
                    <Tab.Pane>
                        {policyReport()}
                    </Tab.Pane>
                )
            },
        }
    ]
    return (
        <React.Fragment>
            <Grid columns={2} padded>
                <Grid.Column>
                    <div className="content-wrapper">
                        <Header as='h2'>
                            <Icon name='file' />
                            <Header.Content>
                                <a href="/staff/dashboard/policies">Policies</a> {'>'} <a href="/staff/dashboard/policies/general">General</a> {'>'} <a href="/staff/dashboard/policies/general/motor">Motor</a> {'>'} Policy Report
                                <Header.Subheader>
                                    Hey there {authContext.user.username}, here is a report for the motor policy
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </div>
                </Grid.Column>

                <Grid.Column width={3} className="clear-left">
                    <ReactHTMLTableToExcel
                        table="individualReport"
                        filename="individualReport"
                        sheet="Sheet 1"
                        buttonText="Download Report"
                    />
                    
                   
                </Grid.Column>
            </Grid>



            <Grid padded>
                <Grid.Column>
                    <Tab panes={panes} />
                </Grid.Column>
            </Grid>

        </React.Fragment>
    )
}
