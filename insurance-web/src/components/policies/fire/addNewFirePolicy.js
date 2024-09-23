/* eslint-disable no-unused-vars */
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DateInput } from 'semantic-ui-calendar-react';
import {
    Button,
    Container,
    Divider,
    Form,
    Grid,
    Header,
    Icon,
    Input,
    Item,
    Label,
    Menu,
    Message,
    Modal,
    Segment,
    Tab
} from 'semantic-ui-react';

import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import * as yup from "yup";
import { AuthContext } from '../../../context/auth';
import { FirePolicyContext } from '../../../context/policy/fire';
import { FETCH_CLIENTS_QUERY, FETCH_CORPORATE_CLIENTS_QUERY } from '../../clients/queries';
import Clients from '../listClients';
import CorporateClients from '../listCorporateClients';
import InsuranceCompanies from '../listInsuranceComps';
import TransactionTypes from '../transactionTypes';

import { FETCH_INSURANCE_COMP, GET_MOTOR_POLICY_OPTS } from '../queries';
import { CREATE_FIRE_POLICY } from './queries';

export default function AddNewFirePolicy(props) {
    const authContext = useContext(AuthContext);
    let history = useHistory();
    const [errors, setErrors] = useState({
        errorPaths: [],
        errors: []
    });
    const [responseErrors, setResponseErrors] = useState([]);
    const context = useContext(FirePolicyContext);
    const [clients, setClients] = useState();
    const [corporateClients, setCorporateClients] = useState();
    const [selectedClient, setSelectedClient] = useState();
    const [selectedCorporateClient, setSelectedCorporateClient] = useState();
    const [selectedInsCompany, setSelectedInsCompany] = useState();
    const [openModal, setOpenModal] = useState(false);
    const [policyOpts, setPolicyOpts] = useState();
    const [insuranceCos, setInsuranceCos] = useState();
    const [addBenefits, setAddBenefits] = useState({});
    const [properties, setFireProps] = useState({});
    const [addBenefitCount, setAddBenefitCount] = useState([0]);
    const [propertiesCount, setFirePropsCount] = useState([0]);
    const [addPremiumCount] = useState([1, 2, 3]);
    const [addPremiums, setAddPremiums] = useState({
        1: {
            premium: "IPHCFLEVY",
            commissionRate: 0.25,
            amount: 0
        },
        2: {
            premium: "TLEVY",
            commissionRate: 0.2,
            amount: 0
        },
        3: {
            premium: "STAMPD",
            minimumAmount: 40
        },
    });
    const [calculated, setCalculated] = useState({
        netPremium: 0,
        grossPremium: 0,
        totalLevies: 0,
        grossCommission: 0,
        netCommission: 0,
        withholdingTax: 0,
        updated: false
    });
    const [search, setSearch] = useState({ search: "" });
    const [corporateSearch, setCorporateSearch] = useState({ corporateSearch: "" });
    const [usersFetched, setUsersFetched] = useState(false);
    const [values, setValues] = useState({
        additionalBenefits: {},
        additionalPremiums: {},
        remarks: "",
        afterSubmit: false,
        commissionRate: 3.75,
        withholdingTax: 10,
        transactionDate: moment().format("YYYY-MM-DD"),
        premiumType: "BASIC",
        properties: []
    });

    let schema = yup.object().shape({
        policyNo: yup.string().required(""),
        individualClient: yup.string(),
        corporateClient: yup.string(),
        insuranceCompany: yup.string().required(""),
        insuranceClass: yup.string().required(""),
        transactionType: yup.string().required(""),
        transactionDate: yup.date().required(""),
        startDate: yup.date().required(""),
        endDate: yup.date().required(""),
        premiumType: yup.string().required(""),
        minimumPremiumAmount: yup.number().required(""),
        commissionRate: yup.number().required(""),
        policyCommissionRate: yup.number().required(""),
        properties: yup.array().of(
            yup.object().shape({
                name:yup.string().required(""),
                description:yup.string().required(""),
                value:yup.number(),
            })).required()
    });


    const { data: policyOptsData } = useQuery(GET_MOTOR_POLICY_OPTS);
    useEffect(() => {
        if (policyOptsData) {
            setPolicyOpts(policyOptsData.motorPolicyOptions);
        }
    }, [policyOptsData, policyOpts]);

    
    const { data: insuranceCosData } = useQuery(FETCH_INSURANCE_COMP, {
        variables: { search: search.searchString }
    });
    useEffect(() => {
        if (insuranceCosData) {
            setInsuranceCos(insuranceCosData.insuranceCompanies.items);
        }
    }, [insuranceCosData, insuranceCos]);

    useEffect(() => {
        let val = 0
        Object.keys(values.properties).forEach(function (key) {
            val += +values.properties[key].value
        });
        if (values.minimumPremiumAmount && val && calculated.updated) {

            let data = {}
            let netPremium = (+values.commissionRate / 100 * +val).toFixed(0)
            if (+values.minimumPremiumAmount < +netPremium) {
                netPremium = parseFloat(values.minimumPremiumAmount).toFixed(0)
            }
            let grossPremium = netPremium
            for (const [key, value] of Object.entries(addBenefits)) {
                let amount = 0
                if (!value.commissionRate && value.benefit && value.minimumAmount) {
                    amount = value.minimumAmount
                    grossPremium = +amount + +grossPremium
                }
                if (value.benefit && value.commissionRate && value.minimumAmount) {
                    amount = parseFloat(grossPremium * value.commissionRate / 100).toFixed(0)
                    if (+value.minimumAmount > +amount) {
                        amount = +value.minimumAmount
                    }
                    grossPremium = +amount + +grossPremium
                    addBenefits[key].amount = +amount
                }
                netPremium = +amount + +netPremium
            }
            data["netPremium"] = netPremium
            let totalLevies = 0
            for (const [key, value] of Object.entries(addPremiums)) {
                let amount = 0
                if (!value.commissionRate) {
                    amount = value.minimumAmount
                }
                if (value.commissionRate) {
                    amount = parseFloat(grossPremium * value.commissionRate / 100).toFixed(0)
                    grossPremium = +amount + +grossPremium
                    addPremiums[key].amount = amount
                }
                if (!value.commissionRate && values.transactionType && values.transactionType === "NEW") {
                    grossPremium = +value.minimumAmount + +grossPremium
                }
                totalLevies += +amount
            }
            data["grossPremium"] = grossPremium
            data["totalLevies"] = totalLevies
            if (values.policyCommissionRate) {
                let grossCommission = (netPremium * parseFloat(values.policyCommissionRate) / 100).toFixed(0)
                let withholdingTax = (grossCommission * 0.1).toFixed(0)
                let netCommission = +grossCommission - +withholdingTax
                data["grossCommission"] = grossCommission
                data["withholdingTax"] = withholdingTax
                data["netCommission"] = netCommission
            }
            setCalculated({ ...calculated, ...data, updated: false })
        }else if(!val && values.minimumPremiumAmount && calculated.updated){

            let data = {}
            let netPremium = values.minimumPremiumAmount
            if (+values.minimumPremiumAmount < +netPremium) {
                netPremium = parseFloat(values.minimumPremiumAmount).toFixed(0)
            }
            let grossPremium = netPremium
            for (const [key, value] of Object.entries(addBenefits)) {
                let amount = 0
                if (!value.commissionRate && value.benefit && value.minimumAmount) {
                    amount = value.minimumAmount
                    grossPremium = +amount + +grossPremium
                }
                if (value.benefit && value.commissionRate && value.minimumAmount) {
                    amount = parseFloat(grossPremium * value.commissionRate / 100).toFixed(0)
                    if (+value.minimumAmount > +amount) {
                        amount = +value.minimumAmount
                    }
                    grossPremium = +amount + +grossPremium
                    addBenefits[key].amount = +amount
                }
                netPremium = +amount + +netPremium
            }
            data["netPremium"] = netPremium
            let totalLevies = 0
            for (const [key, value] of Object.entries(addPremiums)) {
                let amount = 0
                if (!value.commissionRate) {
                    amount = value.minimumAmount
                }
                if (value.commissionRate) {
                    amount = parseFloat(grossPremium * value.commissionRate / 100).toFixed(0)
                    grossPremium = +amount + +grossPremium
                    addPremiums[key].amount = amount
                }
                if (!value.commissionRate && values.transactionType && values.transactionType === "NEW") {
                    grossPremium = +value.minimumAmount + +grossPremium
                }
                totalLevies += +amount
            }
            data["grossPremium"] = grossPremium
            data["totalLevies"] = totalLevies
            if (values.policyCommissionRate) {
                let grossCommission = (netPremium * parseFloat(values.policyCommissionRate) / 100).toFixed(0)
                let withholdingTax = (grossCommission * 0.1).toFixed(0)
                let netCommission = +grossCommission - +withholdingTax
                data["grossCommission"] = grossCommission
                data["withholdingTax"] = withholdingTax
                data["netCommission"] = netCommission
            }
            setCalculated({ ...calculated, ...data, updated: false })
        }
    }, [calculated, values, addPremiums, addBenefits])

    const [fetchClients, { data: clientsData }] = useLazyQuery(FETCH_CLIENTS_QUERY, {
        variables: search
    });

    useEffect(() => {
        if (!usersFetched) {
            fetchClients()
        }
        if (clientsData) {
            setClients(clientsData.individualClients.items);
            setUsersFetched(true)
        }
    }, [clientsData, clients, fetchClients, usersFetched]);
    const [fetchCorporateClients, { data: corporateClientsData }] = useLazyQuery(FETCH_CORPORATE_CLIENTS_QUERY, {
        variables: corporateSearch
    });
    useEffect(() => {
        if (!usersFetched) {
            fetchCorporateClients()
        }
        if (corporateClientsData) {
            setCorporateClients(corporateClientsData.corporateClients.items);
            setUsersFetched(true)
        }
    }, [corporateClientsData, corporateClients, fetchCorporateClients, usersFetched]);
    const validate = useCallback((values) => {
        schema.validate(values, { abortEarly: false })
            .then(valid => setErrors({ errorPaths: [], errors: [] })) //called if the entire form is valid
            .catch(err => {
                setErrors({ errors: err.errors, errorPaths: err.inner.map(i => i.path) })
            })
    }, [schema])

    const [createPolicy, { loading }] = useCallback(useMutation(CREATE_FIRE_POLICY,
        {
            update(_, result) {
                context.createFirePolicy(result.data);

                let pol = result.data.createFirePolicy.firePolicy
                context.createFirePolicy(result.data.createFirePolicy.firePolicy)
                history.push({
                    pathname: `/staff/dashboard/policies/general/motor/details/${pol.id}`,
                    state: { firePolicy: pol }
                })
            },
            onError(err) {
                console.log(err.graphQLErrors && err.graphQLErrors[0] ? err.graphQLErrors[0].message : err.networkError && err.networkError.result ? err.networkError.result.errors : err)
                try {
                    if (err.graphQLErrors) {
                        setResponseErrors(err.graphQLErrors[0].message);
                    }

                    if (err.networkError !== null && err.networkError !== 'undefined') {

                        setResponseErrors(err.networkError.result.errors[0]);

                    } else if (err.graphQLErrors !== null && err.networkError !== 'undefined') {

                        setResponseErrors(err.graphQLErrors.result.errors[0]);

                    }
                } catch (e) {
                    console.log(e)
                }

            },
            variables: values,
        }));
    const onChange = useCallback((event, { name, value }) => {
        setValues({ ...values, [name]: value, updated: true });
        setCalculated({ ...calculated, updated: true })
    }, [values, calculated])

    const handleOnClientSearch = (e) => {
        setSearch({ search: e.target.value });
    }
    const handleOnClientChange = (e, { value }) => {
        e.preventDefault()
        const data = { individualClient: value, corporateClient: values.corporateClient }
        if (data.corporateClient) {
            data.corporateClient = ""
        }
        setValues({ ...values, ...data, updated: true });
        // validate()
    }
    const handleOnCorporateClientSearch = (e) => {

        setCorporateSearch({ corporateSearch: e.target.value });
    }
    const handleOnCorporateClientChange = (e, { value }) => {
        e.preventDefault()
        const data = { individualClient: values.individualClient, corporateClient: value }
        if (data.individualClient) {
            data.individualClient = ""
        }
        setValues({ ...values, ...data, updated: true });
        // validate()

    }
    
    useEffect(() => {
        if (values.individualClient) {
            let client = clients.find(x => x.id === values.individualClient)
            setSelectedClient(client)
        }
    }, [clients, values.individualClient])

    useEffect(() => {
        if (values.corporateClient) {
            let corporateClient = corporateClients.find(x => x.id === values.corporateClient)
            setSelectedCorporateClient(corporateClient)
        }
    }, [corporateClients, values.corporateClient])

    useEffect(() => {
        if (values.insuranceCompany) {
            let comp = insuranceCos.find(x => x.id === values.insuranceCompany)
            setSelectedInsCompany(comp)
        }
    }, [insuranceCos, values.insuranceCompany])
    const handleOnInsuranceCompChange = (e, { value }) => {
        e.preventDefault()
        setValues({ ...values, insuranceCompany: value, updated: true });
    }
    const handleOnTransactionTypesChange = (e, { value }) => {
        e.preventDefault()
        setValues({ ...values, transactionType: value, updated: true });
    }
    const handleOnInsuranceClassChange = (e, { value }) => {
        e.preventDefault()
        let newValues = { ...values, insuranceClass: value, updated: true }
        setValues(newValues)

    }
    const handleOnAddPremTypesChange = (e, { value }) => {
        e.preventDefault()
        let key = e.target.name ? e.target.id : value.split("_")[1]
        if (!e.target.name) {
            let data = { premium: value.split("_")[0] }
            if (Object.keys(addPremiums).length > 0) {
                setAddPremiums(prevAddPrem => ({
                    ...prevAddPrem,
                    [key]: { ...prevAddPrem[key], ...data }
                }));
            } else {
                let newPrem = { ...addPremiums, [key]: data }
                setAddPremiums(newPrem);
            }
        }
        else {

            if (Object.keys(addPremiums).length > 0) {
                let data = { [e.target.name]: value }
                setAddPremiums(prevAdsPrem => ({
                    ...prevAdsPrem,
                    [key]: { ...prevAdsPrem[key], ...data }
                }));
            }
            else {

                let newVal = { ...addPremiums, [key]: { ...addPremiums[key], [e.target.name]: value } }
                setAddPremiums(newVal)
            }
        }
        setValues({ ...values, updated: true });


    }

    const handleOnAddBenefitTypesChange = (e, { value }) => {
        e.preventDefault()
        let key = e.target.name ? e.target.id : value.split("_")[1]
        if (!e.target.name) {
            let data = { benefit: value.split("_")[0], amount: 0 }
            if (Object.keys(addBenefits).length > 0) {
                setAddBenefits(prevAddBen => ({
                    ...prevAddBen,
                    [key]: { ...prevAddBen[key], ...data }
                }));
            } else {
                let newBenefit = { ...addBenefits, [key ? key : 0]: data }
                setAddBenefits(newBenefit);
            }

        }
        else {
            if (Object.keys(addBenefits).length > 0) {
                let data = { [e.target.name]: value, amount: 0 }
                setAddBenefits(prevAddBen => ({
                    ...prevAddBen,
                    [key]: { ...prevAddBen[key], ...data }
                }));
            }
            else {
                let newVal = { ...addBenefits, [key]: { ...addBenefits[key], [e.target.name]: value, amount: 0 } }
                setAddBenefits(newVal)
            }
        }
        setValues({ ...values, updated: true });
        setCalculated({ ...calculated, updated: true })

    }
    const handleOnFireChange = (e, { value }) => {
        e.preventDefault()
        let key = e.target.id
        let data = { [e.target.name]: value }
        if (Object.keys(properties).length > 0) {
            setFireProps(prevVehicle => ({
                ...prevVehicle,
                [key]: { ...prevVehicle[key], ...data }
            }));
        } else {
            let newVal = { ...properties, [key]: { ...properties[key], [e.target.name]: value } }
            setFireProps(newVal)
        }
        setValues({ ...values, updated: true })

    }
    const handleAddAdditionalBenefit = useCallback((e) => {
        e.preventDefault();
        if (addBenefitCount.length) {
            setAddBenefitCount([...addBenefitCount, addBenefitCount[addBenefitCount.length - 1] + 1])
        }
        else { setAddBenefitCount([1]) }
    }, [addBenefitCount])
    const handleAddVehicle = useCallback((e) => {
        e.preventDefault();
        if (propertiesCount.length) {
            setFirePropsCount([...propertiesCount, propertiesCount[propertiesCount.length - 1] + 1])
        }
        else { setFirePropsCount([1]) }
    }, [propertiesCount])
    const handleRemoveAdditionalBenefit = useCallback((event) => {
        event.preventDefault();
        const newArr = addBenefitCount.filter(e => e !== Number(event.target.id))
        setAddBenefitCount(newArr)
        if (Object.keys(addBenefits).length > 0) {
            delete addBenefits[event.target.id]
        }
        setValues({ ...values, updated: true });
        setCalculated({ ...calculated, updated: true })
        

    }, [addBenefitCount, addBenefits, calculated, values])
    const handleRemoveVehicle = useCallback((event) => {
        event.preventDefault();
        const newArr = propertiesCount.filter(e => e !== Number(event.target.id))
        setFirePropsCount(newArr)
        if (Object.keys(properties).length > 0) {
            delete properties[event.target.id]
        }

    }, [properties, propertiesCount])
    useEffect(() => {
        if (values.updated) {
            setValues({
                ...values, additionalBenefits: Object.values(addBenefits),
                properties: Object.values(properties),
                additionalPremiums: Object.values(addPremiums), updated: false
            })
            if (values.afterSubmit) {
                validate(values)
            }
            setOpenModal(false)
        }
    }, [values, addBenefits, addPremiums, validate, properties])
    const onPreview = (event) => {
        event.preventDefault();
        validate(values)
        setValues({ ...values, afterSubmit: true })
        setOpenModal(true)
        if (Object.keys(values).length > 7 && !errors.errors.length) { setOpenModal(true) }
    }
    
    function firePolicyDetails() {
        return (
            <Container>
                <Grid container columns={2} divided relaxed stackable>
                    <Grid.Column>
                        <Segment><Header as='h3'>Client details</Header></Segment>
                        <Item.Group>
                            <Item>

                                <Item.Content>
                                    <Divider horizontal>Basic Information</Divider>
                                    {values.individualClient && <Item.Description>
                                        <b>Name: </b><span className='price'>{selectedClient.firstName} {selectedClient.lastName} {selectedClient.surname}</span><br />
                                        <b>Email: </b><span className='price'>{selectedClient.email}</span><br />
                                        <b>Phone Number: </b><span className='price'>{selectedClient.phoneNumber}</span><br />
                                        <b>ID Number: </b><span className='price'>{selectedClient.idNumber}</span><br />
                                        <b>kra Pin: </b><span className='price'>{selectedClient.kraPin}</span><br />
                                    </Item.Description>}
                                    {values.corporateClient &&
                                        <Item.Description>
                                            <b>Name: </b><span className='price'>{selectedCorporateClient.name}</span><br />
                                            <b>Email: </b><span className='price'>{selectedCorporateClient.email}</span><br />
                                            <b>Phone Number: </b><span className='price'>{selectedCorporateClient.phoneNumber}</span><br />
                                            <b>kra Pin: </b><span className='price'>{selectedCorporateClient.kraPin}</span><br />
                                        </Item.Description>}
                                </Item.Content>
                            </Item>

                            <Item>

                                <Item.Content>
                                    <Divider horizontal>Policy Information</Divider>
                                    <Item.Description>
                                        <b>Policy Number: </b><span className='price'>{values.policyNo}</span><br />
                                        <b>Insurance Class: </b><span className='price'>{policyOpts.insurance_class_options[values.insuranceClass]}</span><br />
                                        <b>Insurance Company: </b><span className='price'>{selectedInsCompany.name}</span><br />
                                        <b>Transaction Type: </b><span className='price'>{policyOpts.transaction_type_options[values.transactionType]}</span><br />
                                        <b>Start Date: </b><span className='price'>{values.startDate}</span><br />
                                        <b>End Date: </b><span className='price'>{values.endDate}</span><br />
                                        <b>Renewal Date: </b><span className='price'>{values.renewalDate || "None"}</span><br />
                                        <b>Transaction Date: </b><span className='price'>{values.transactionDate}</span><br />
                                    </Item.Description>
                                </Item.Content>
                            </Item>
                        </Item.Group>

                    </Grid.Column>
                    <Grid.Column>
                        <Segment><Header as='h3'>Fire details</Header></Segment>
                        <Item.Group>
                            {values.properties.map((property, key) => (
                                <Item key={key}>
                                    <Item.Content>
                                        <Divider horizontal>Basic Information</Divider>
                                        <Item.Description>
                                            <b>Name: </b><span className='price'>{property.name} </span><br />
                                            <b>Description: </b><span className='price'>{property.description} </span><br />
                                            <b>Value: </b><span className='price'>Ksh {property.value ? property.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):0} </span><br />
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            ))}
                        </Item.Group>
                    </Grid.Column>
                </Grid>
                {values.remarks &&
                    <Grid container columns={1} divided relaxed stackable>
                        <Grid.Column>
                            <Segment><Header as='h3'>Remarks</Header></Segment>
                            <Item.Group>
                                <Item>

                                    <Item.Content>
                                        <Item.Description>
                                            <div dangerouslySetInnerHTML={{ __html: values.remarks }} />
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                        </Grid.Column>
                    </Grid>}
            </Container>
        )
    }
    function premiumDetails() {
        return (
            <Container>
                <Grid container columns={values.additionalPremiums && values.additionalBenefits.length ? 3 : !!(values.additionalPremiums.length || values.additionalBenefits.length) ? 2 : 1} divided relaxed stackable>

                    <Grid.Column>
                        <Segment><Header as='h3'>Basic Premium</Header></Segment>
                        <Item.Group>
                            <Item>

                                <Item.Content>
                                    <Divider horizontal>Basic Premiums Info</Divider>
                                    <Item.Description>
                                        <b>Premium Type: </b><span className='price'>Basic Premium </span><br />
                                        <b>Premium Rate: </b><span className='price'>{values.commissionRate}% </span><br />
                                        <b>Minimum Premium Amount: </b><span className='price'>Ksh {values.minimumPremiumAmount} </span><br />
                                        <span><b>Amount: </b><span className='price'>Ksh {calculated.netPremium.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br /></span>
                                    </Item.Description>
                                </Item.Content>

                            </Item>

                        </Item.Group>
                    </Grid.Column>

                    {!!values.additionalPremiums.length && <Grid.Column>
                        <Segment><Header as='h3'>Additional Levies</Header></Segment>
                        <Item.Group>
                            {values.additionalPremiums.map((premium, i) => (<Item.Content key={i}>
                                <Item>
                                    <Divider horizontal>.{i + 1}.</Divider>
                                    <Item.Description>
                                        <b>Levy Type: </b><span className='price'>{policyOpts.premium_type_options[addPremiums[i + 1].premium]} </span><br />
                                        {premium.commissionRate && <span><b>Levy Rate: </b><span className='price'>{premium.commissionRate + "%"}  </span><br /></span>}
                                        <span><b>Amount: </b><span className='price'>Ksh {addPremiums[i + 1] && addPremiums[i + 1].amount ? addPremiums[i + 1].amount : addPremiums[i + 1].minimumAmount ? addPremiums[i + 1].minimumAmount : "0"} </span><br /></span>
                                    </Item.Description>
                                </Item>
                            </Item.Content>))}
                        </Item.Group>
                    </Grid.Column>}
                </Grid>

                <div>
                    <br /><br /><Segment><Header as='h3' size="medium" textAlign="center">Policy Premium Totals</Header></Segment>
                    <Grid container columns={1} divided relaxed stackable>
                        <Grid.Column>
                            <Item.Group>
                                <Item>
                                    <Item.Content>
                                        <Item.Description>
                                            <b>Net Premium:</b><span className='price'>Ksh {calculated.netPremium.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br />
                                            <b>Total Levies:</b><span className='price'>Ksh {calculated.totalLevies.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br />
                                            <b>Gross Premium:</b><span className='price'>Ksh {calculated.grossPremium.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br /><br />
                                            <b>Gross Commission: </b><span className='price'>Ksh {calculated.grossCommission.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br />
                                            <b>Withholding Tax: </b><span className='price'>Ksh {calculated.withholdingTax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br />
                                            <b>Net Commission: </b><span className='price'>Ksh {calculated.netCommission.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span><br />
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                        </Grid.Column>

                    </Grid></div>

            </Container>
        )
    }
    const panes = [
        {
            menuItem: (
                <Menu.Item key='policy'>
                    Fire Policy Details
                </Menu.Item>
            ),
            render: () => {
                return (
                    <Tab.Pane>
                        {firePolicyDetails()}

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
            <Grid container padded>
                <Grid.Column>
                    <div className="content-wrapper">
                        <Header as='h2'>
                            <Icon name='settings' />
                            <Header.Content>
                                <a href="/staff/dashboard/policies">Policy Records</a> {'>'} <a href="/staff/dashboard/policies/general">General</a> {'>'} <a href="/staff/dashboard/policies/general/motor">Fire</a> {'>'} Create New Fire Policy
                                <Header.Subheader>
                                    Hello {authContext.user.username}, Fill in this form to create motor policy
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </div>
                </Grid.Column>
            </Grid>

            <Grid container padded>
                <Grid.Column>
                    <Form onSubmit={onPreview} noValidate className={loading ? "loading" : ''}>
                        <Form.Group>
                            <Message visible={!!(!!errors.errors.length | !!responseErrors.length)} warning>
                                <Message.Header>Please correct the following issues:</Message.Header>
                                {!!responseErrors.length && <Message>{responseErrors}</Message>}
                                {<Message.List items={errors.errors} />}
                            </Message>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field error={errors.errorPaths.includes('individualClient')}>
                                <label>Individual Client</label>
                                {clients && <Clients
                                    clients={clients}
                                    hand
                                    leOnClientSearch={handleOnClientSearch}
                                    handleO
                                    nClientCh
                                    ange={handleOnClientChange}
                                />}
                            </Form.Field>
                            <Form.Field error={errors.errorPaths.includes('corporateClient')}>
                                <label>Corporate</label>
                                {corporateClients && <CorporateClients
                                    corporateClients={corporateClients}
                                    handleOnCorporateClientSearch={handleOnCorporateClientSearch}
                                    handleOnCorporateClientChange={handleOnCorporateClientChange}
                                />}
                            </Form.Field>
                            <Form.Field error={errors.errorPaths.includes('policyNo')}>
                                <label>Policy Number</label>
                                <Input fluid placeholder='Policy Number'
                                    name="policyNo" onChange={onChange}
                                    values={values.policyNo} />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required error={errors.errorPaths.includes('insuranceCompany')}>
                                <label>Insurance Company</label>
                                {insuranceCos && <InsuranceCompanies
                                    insuranceCompanies={insuranceCos}
                                    handleOnInsuranceCompChange={handleOnInsuranceCompChange}
                                />}
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('transactionType')}>
                                <label>Transaction Type</label>
                                {policyOpts && policyOpts.transaction_type_options && <TransactionTypes
                                    transactionTypes={policyOpts.transaction_type_options}
                                    handleOnTransactionTypesChange={handleOnTransactionTypesChange}
                                />}
                            </Form.Field>
                            
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required error={errors.errorPaths.includes('startDate')}>
                                <label>Start Date</label>
                                <DateInput
                                    autoComplete="off"
                                    name="startDate"
                                    placeholder="Start Date"
                                    popupPosition="bottom left"
                                    value={values.startDate ? values.startDate : ""}
                                    iconPosition="left"
                                    dateFormat="YYYY-MM-DD"
                                    onChange={onChange}
                                />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('endDate')}>
                                <label>End Date</label>
                                <DateInput
                                    name="endDate"
                                    autoComplete="off"
                                    placeholder="End Date"
                                    popupPosition="bottom left"
                                    value={values.endDate ? values.endDate : ""}
                                    dateFormat="YYYY-MM-DD"
                                    iconPosition="left"
                                    onChange={onChange}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Divider horizontal>Fire Details</Divider>
                        < Form.Group widths='equal'>
                            <Form.Field>
                                <Button icon floated='right' onClick={handleAddVehicle}>
                                    <Icon name='plus square outline' />
                                </Button>
                            </Form.Field>
                        </Form.Group>
                        {propertiesCount.map(key => (
                            <div key={key}>
                                <Divider horizontal style={{ textTransform: "capitalize" }}>Fire Policy{key + 1}</Divider>
                                <Form.Group widths='equal'>
                                    <Form.Field required error={errors.errorPaths.includes(`properties[${key}].name`)}>
                                        <label>Name</label>
                                        <Input fluid placeholder='Description'
                                            name="name" onChange={handleOnFireChange}
                                            id={key}
                                            values={properties[key] && properties[key].name ? properties[key].name : ''} />
                                    </Form.Field>
                                    <Form.Field error={errors.errorPaths.includes(`properties[${key}].value`)}>
                                        <label>Value</label>
                                        <Input fluid placeholder='Current Value'
                                            name="value" type="number" onChange={handleOnFireChange}
                                            id={key}
                                            values={properties[key] && properties[key] ? properties[key].value : ''} />
                                    </Form.Field>
                                    <Form.Field>
                                        <Grid>
                                            <label><b>Description <span style={{ color: "red" }}>*</span></b></label>
                                            <Grid.Column width={12} as={Form.Field} required error={errors.errorPaths.includes(`properties[${key}].description`)}>

                                                <Input fluid placeholder='Make'
                                                    name="description" onChange={handleOnFireChange}
                                                    id={key}
                                                    values={properties[key] && properties[key].description ? properties[key].description : ''} />
                                            </Grid.Column>
                                            <Grid.Column width={4}>
                                                <Button id={key} key={key} icon floated='right' onClick={handleRemoveVehicle} size="small" disabled={propertiesCount.length > 1 ? false : true}>
                                                    <Icon name='trash alternate' id={key} key={key} />
                                                </Button>
                                            </Grid.Column>
                                        </Grid>
                                    </Form.Field>
                                </Form.Group>
                                
                                <br /><br />
                            </div>
                        ))}
                        <Divider horizontal>Premiums Details</Divider>
                        <Form.Group widths='equal'>
                            <Form.Field required error={errors.errorPaths.includes('premiumType')}>
                                <label>Premium Type</label> 
                                <Input fluid placeholder='Basic Premium'
                                    name="premiumType"
                                    value="Basic Premium" />    
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('minimumPremiumAmount')}>
                                <label>Minimum Premium Amount</label>   
                                <Input fluid placeholder='Minimum Premium Amount'
                                    name="minimumPremiumAmount" type="number"
                                    onChange={onChange}
                                    values={values.minimumPremiumAmount} />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('commissionRate')}>  
                                <label>Premium Rate (%)</label> 
                                <Input fluid placeholder='Premium Rate'
                                    name="commissionRate"
                                    type="number" step="any"
                                    onChange={onChange}
                                    value={values.commissionRate} />
                            </Form.Field>
                        </Form.Group>
                        
                        <Divider horizontal>Additional Levies</Divider>
                        {addPremiumCount.map(key => (<Form.Group widths={2} key={key}>
                            <Form.Field>
                                <label>Levy Type</label>
                                {policyOpts && policyOpts.premium_type_options &&
                                    <Input fluid
                                        name="premiumType"
                                        value={policyOpts.premium_type_options[addPremiums[key].premium]} />}
                            </Form.Field>
                            {addPremiums[key].commissionRate ? <Form.Field>
                                <label className="ui center aligned">Levy Rate (%)</label>
                                <Input fluid placeholder='Levy Rate'
                                    name="commissionRate"
                                    type="number" step="any"
                                    id={key}
                                    onChange={handleOnAddPremTypesChange}
                                    value={addPremiums[key] ? addPremiums[key].commissionRate : ""} />
                            </Form.Field> : <Form.Field></Form.Field>}
                            <Form.Field>
                                <label className="ui center aligned">Levy Amount</label>
                                <Grid>
                                    <Grid.Row centered width={4}>
                                        <Label size="large">{addPremiums[key] && addPremiums[key].amount ? addPremiums[key].amount : addPremiums[key].minimumAmount ? addPremiums[key].minimumAmount : "0"}</Label>
                                    </Grid.Row>
                                </Grid>
                            </Form.Field>
                        </Form.Group>))}
                        <Divider horizontal>Totals</Divider>
                        <Form.Group widths='equal'>
                            <Form.Field width="11">
                                <label>Net Premium</label>
                                <Label size="large">{calculated.netPremium.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Label>
                            </Form.Field>
                            <Form.Field >
                                <label>Total Levies</label>
                                <Label size="large">{calculated.totalLevies.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Label>
                            </Form.Field>
                            <Form.Field >
                                <label>Gross Premium</label>
                                <Label size="large">{calculated.grossPremium.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Label>
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('policyCommissionRate')}>
                                <label>Commission Rate (%)</label>
                                <Input fluid placeholder='Commission Rate'
                                    name="policyCommissionRate"
                                    type="number" onChange={onChange}
                                    value={values.policyCommissionRate ? values.policyCommissionRate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""} />
                            </Form.Field>
                            <Form.Field>
                                <label>Gross Commission</label>
                                <Label size="large">{calculated.grossCommission.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Label>

                            </Form.Field>
                            <Form.Field>
                                <label>Withholding Tax</label>
                                <Label size="large">{calculated.withholdingTax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Label>

                            </Form.Field>
                            <Form.Field>
                                <label>Net Commission</label>
                                <Label size="large">{calculated.netCommission.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Label>
                            </Form.Field>
                        </Form.Group>

                        <Divider horizontal>Remarks</Divider>
                        <CKEditor
                            editor={ClassicEditor}
                            data={values.remarks}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setValues({ ...values, remarks: data })

                            }} />
                        <Divider horizontal>...</Divider>
                        <Button type='submit'>Preview Fire Policy</Button>

                    </Form>
                </Grid.Column>
            </Grid>
            {!!calculated.netCommission && <Modal
                dimmer={"blurring"}
                closeIcon
                open={openModal}
                onClose={() => setOpenModal(false)}>
                <Modal.Header>Fire Policy Preview</Modal.Header>
                <Modal.Content>
                    <Grid container padded>
                        <Grid.Column>
                            <Tab panes={panes} />
                        </Grid.Column>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive onClick={() => { createPolicy(); setOpenModal(false); setResponseErrors([]) }}>
                        Save Policy
                    </Button>
                </Modal.Actions>
            </Modal>}
        </Container >
    )
}
