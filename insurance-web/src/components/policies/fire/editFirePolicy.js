import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
    Grid,
    Container,
    Header,
    Icon,
    Form,
    Input,
    Button,
    Divider,
    Message
} from 'semantic-ui-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';
import { MotorPolicyContext } from '../../../context/policy/motor';
import {
    DELETE_ADDITIONAL_PREM, DELETE_ADDITIONAL_BEN,
    UPDATE_MOTOR_POLICY,
    GET_MOTOR_POLICY, GET_MOTOR_POLICY_OPTS,
    FETCH_INSURANCE_COMP
} from '../queries'
import Clients from '../listClients'
import TransactionTypes from '../transactionTypes'
import PremiumTypes from '../premiumTypes'
import InsuranceCompanies from '../listInsuranceComps'
import { FETCH_CLIENTS_QUERY } from '../../clients/queries'
import * as yup from "yup";
import { Link } from 'react-router-dom';

export default function EditMotorPolicy(props) {
    const policyId = props.match.params.policyId
    const [errors, setErrors] = useState({
        errorPaths: [],
        errors: []
    });
    const [motorPolicy, setMotorPolicy] = useState({});

    const [responseErrors, setResponseErrors] = useState([]);
    const context = useContext(MotorPolicyContext);
    const [clients, setClients] = useState();
    const [toDelete, setToDelete] = useState({ additionalPremiums: [], additionalBenefits: [] });
    const [policyOpts, setPolicyOpts] = useState();
    const [deleteBenItem, setDeleteBenItem] = useState({ id: [], deleted: false });
    const [deletePremItem, setDeletePremItem] = useState({ id: [], deleted: false });
    const [insuranceCos, setInsuranceCos] = useState();
    const [addBenefits, setAddBenefits] = useState({});
    const [addBenefitCount, setAddBenefitCount] = useState([1]);
    const [additionalFetched, setAdditionalFetched] = useState(false);
    const [addPremiumCount, setAddPremiumCount] = useState([1]);
    const [addPremiums, setAddPremiums] = useState({});
    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState({ search: "" });
    const [usersFetched, setUsersFetched] = useState(false);
    const [values, setValues] = useState({
        afterSubmit: false,
        done: false,
        fetched: false,
        id: "",
        debitNoteNo: "",
        policyNo: "",
        individualClient: "",
        transactionDate: "",
        insuranceCompany: "",
        startDate: "",
        endDate: "",
        renewalDate: "",
        minimumPremiumAmount: null,
        value: null,
        insuranceClass: "",
        transactionType: "",
        remarks: "",
        commissionRate: 3.75,
        premiumType: "BASIC",
        additionalBenefits: {},
        additionalPremiums: {},

    });

    let schema = yup.object().shape({
        debitNoteNo: yup.string().required("Please provide a Debit Note Number"),
        policyNo: yup.string().required("Please provide a Policy Number"),
        individualClient: yup.string().required("Please select a client"),
        insuranceCompany: yup.string().required("Please select an insurance company"),
        insuranceClass: yup.string().required("Please select an insurance class"),
        transactionType: yup.string().required("Please select a transaction type"),
        transactionDate: yup.date().required("Please select a transaction date"),
        startDate: yup.date().required("Please select a start date"),
        endDate: yup.date().required("Please select a end date"),
        yearOfManufacture: yup.number().required("Please select the vehicle year of manufacture"),
        premiumType: yup.string().required("Please select a premium type"),
        minimumPremiumAmount: yup.number().required("Please provide the minimum premium amount"),
        commissionRate: yup.number().required("Please provide the premium commission rate"),
        value: yup.number().required("Please provide the vehicle value"),
        tonnage: yup.number().required("Please provide the vehicle tonnage"),
        seatingCapacity: yup.number().required("Please provide the vehicle siting capacity"),
        registrationNo: yup.string().required("Please provide the vehicle registration number"),
        make: yup.string().required("Please provide the vehicle make"),
        model: yup.string().required("Please provide the vehicle model"),
        body: yup.string().required("Please provide the vehicle body"),
        color: yup.string().required("Please provide the vehicle color"),
        engineNo: yup.string().required("Please provide the vehicle engine number"),
        chassisNo: yup.string().required("Please provide the vehicle chassis number"),
        cc: yup.string().required("Please provide the vehicle cc"),
    });


    const { data: motorPolicyData } = useQuery(GET_MOTOR_POLICY, {
        variables: { id: policyId }
    });
    useEffect(() => {
        if (!values.fetched && motorPolicyData) {
            let data = motorPolicyData.motorPolicy
            let currentAddBen = {}
            let currentAddPrem = {}
            let benefitIds = []
            let premiumIds = []
            data.additionalBenefits.forEach((benefit, key) => {
                currentAddBen[key + 1] = {
                    benefit: benefit.benefit,
                    commissionRate: benefit.commissionRate,
                    minimumAmount: benefit.minimumAmount,
                }
                benefitIds.push(benefit.id)
            })
            data.additionalPremiums.forEach((premium, key) => {
                currentAddPrem[key + 1] = {
                    premium: premium.premium,
                    commissionRate: premium.commissionRate,
                    minimumAmount: premium.minimumAmount,
                }
                premiumIds.push(premium.id)
            })
            setAddPremiums(currentAddPrem);
            setAddBenefits(currentAddBen);
            setToDelete({ ...toDelete, additionalPremiums: premiumIds, additionalBenefits: benefitIds });
            let individualClient = data.individualClient.id
            let insuranceCompany = data.insuranceCompany.id
            if (!additionalFetched) {
                let addBens = data.additionalBenefits.length
                let addPrems = data.additionalPremiums.length
                let newAddBen = []
                for (let i = 1; i <= addBens; i++) {
                    newAddBen.push(i)
                }
                let newAddPrem = []
                for (let i = 1; i <= addPrems; i++) {
                    newAddPrem.push(i)
                }
                setAddBenefitCount(newAddBen)
                setAddPremiumCount(newAddPrem)
                setAdditionalFetched(true)
            }
            delete data.additionalBenefits
            delete data.additionalPremiums
            delete data.individualClient
            setValues({ ...values, ...data, update: true, fetched: true, insuranceCompany, individualClient, ...data.vehicleDetails, id: policyId });

        }
    }, [motorPolicyData, context, addBenefitCount, additionalFetched, addPremiumCount, values, policyId, toDelete]);

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
    const [deletePrem, { data: deletedPrem }] = useMutation(DELETE_ADDITIONAL_PREM, {
        onError(err) {

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
                setVisible(true);
            }
        },
        variables: { id: deletePremItem.id }
    })
    const [deleteBen, { data: deletedBen }] = useMutation(DELETE_ADDITIONAL_BEN, {
        onError(err) {

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
                setVisible(true);
            }
        },
        variables: { id: deleteBenItem.id }
    })
    useEffect(() => {
        if (deletedPrem) {
            console.log(deletedPrem)
        }
        if (deletedBen) {
            console.log(deletedBen)
        }
    })

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
    const validate = useCallback((values) => {
        schema.validate(values, { abortEarly: false })
            .then(valid => setErrors({ errorPaths: [], errors: [] })) //called if the entire form is valid
            .catch(err => {
                setErrors({ errors: err.errors, errorPaths: err.inner.map(i => i.path) })
            })
    }, [schema])
    const [updatePolicy, { loading }] = useCallback(useMutation(UPDATE_MOTOR_POLICY,
        {
            update(_, result) {
                context.updatePolicy(result.data);
                setVisible(false);

                console.log("response", result.data);
                console.log("saved data", result.data);
                setMotorPolicy(result.data.updateMotorPolicy.motorPolicy)

                setValues({ ...values, done: true });
            },
            onError(err) {

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
                    setVisible(true);
                }
            },
            variables: values,
        }));
    const onChange = useCallback((event) => {
        setValues({ ...values, [event.target.name]: event.target.value, updated: true });
    }, [values])

    const handleOnClientSearch = (e) => {
        setSearch({ search: e.target.value });
    }
    const handleOnClientChange = (e, { value }) => {
        e.preventDefault()
        setValues({ ...values, individualClient: value, updated: true });
        // validate()
    }
    const handleOnInsuranceCompChange = (e, { value }) => {
        e.preventDefault()
        setValues({ ...values, insuranceCompany: value, updated: true });
    }
    const handleOnTransactionTypesChange = (e, { value }) => {
        e.preventDefault()
        setValues({ ...values, transactionType: value, updated: true });
    }
    const handleOnPremiumTypesChange = (e, { value }) => {
        e.preventDefault()
        if (!e.target.name) {
            let newValues = { ...values, premiumType: value, updated: true }
            setValues(newValues)
        }
        else { setValues({ ...values, [e.target.name]: e.target.value, updated: true }) }
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
            let data = { benefit: value.split("_")[0] }
            if (Object.keys(addBenefits).length > 0) {
                setAddBenefits(prevAddBen => ({
                    ...prevAddBen,
                    [key]: { ...prevAddBen[key], ...data }
                }));
            } else {
                let newBenefit = { ...addBenefits, [key]: data }
                setAddBenefits(newBenefit);
            }
        }
        else {
            if (Object.keys(addBenefits).length > 0) {
                let data = { [e.target.name]: value }
                setAddBenefits(prevAddBen => ({
                    ...prevAddBen,
                    [key]: { ...prevAddBen[key], ...data }
                }));
            }
            else {

                let newVal = { ...addBenefits, [key]: { ...addBenefits[key], [e.target.name]: value } }
                setAddBenefits(newVal)
            }
        }
        setValues({ ...values, updated: true });

    }
    const handleAddAdditionalBenefit = useCallback((e) => {
        e.preventDefault();
        if (addBenefitCount.length) {
            setAddBenefitCount([...addBenefitCount, addBenefitCount[addBenefitCount.length - 1] + 1])
        }
        else { setAddBenefitCount([1]) }
    }, [addBenefitCount])
    const handleAddAdditionalPremium = useCallback((e) => {
        e.preventDefault();
        if (addPremiumCount.length) { setAddPremiumCount([...addPremiumCount, addPremiumCount[addPremiumCount.length - 1] + 1]) }
        else { setAddPremiumCount([1]) }
    }, [addPremiumCount])
    const handleRemoveAdditionalBenefit = useCallback((event) => {
        event.preventDefault();
        const newArr = addBenefitCount.filter(e => e !== Number(event.target.id))
        setAddBenefitCount(newArr)
        if (Object.keys(addBenefits).length > 0) {
            delete addBenefits[event.target.id]
        }

    }, [addBenefits, addBenefitCount])
    const handleRemoveAdditionalPremium = useCallback((event) => {
        event.preventDefault();
        const newArr = addPremiumCount.filter(e => e !== Number(event.target.id))
        setAddPremiumCount(newArr)
        if (Object.keys(addPremiums).length > 0) {
            delete addPremiums[event.target.id]
        }

    }, [addPremiums, addPremiumCount])
    useEffect(() => {
        if (values.updated) {
            setValues({ ...values, additionalBenefits: Object.values(addBenefits), additionalPremiums: Object.values(addPremiums), updated: false })
            if (values.afterSubmit) {
                validate(values)
            }
        }
    }, [values, addBenefits, addPremiums, validate])
    const deleteAdditional = () => {
        if (Object.keys(values.additionalBenefits).length) {
            setDeleteBenItem({ id: toDelete.additionalBenefits, deleted: false })
        }
        if (Object.keys(values.additionalPremiums).length) {
            setDeletePremItem({ id: toDelete.additionalPremiums, deleted: false })
        }
    }
    useEffect(() => {
        if (!deleteBenItem.deleted && deleteBenItem.id.length) {
            deleteBen()
            setDeleteBenItem({ ...deleteBenItem, deleted: true, id: [] })
        }
        if (!deletePremItem.deleted && deletePremItem.id.length) {
            deletePrem()
            setDeletePremItem({ ...deletePremItem, deleted: true, id: [] })
        }

    }, [deleteBen, deleteBenItem, deletePrem, deletePremItem])
    function onSubmit(event) {
        event.preventDefault();
        validate(values);
        setValues({ ...values, afterSubmit: true });
        if (Object.keys(values).length > 7 && !errors.errors.length) { updatePolicy() }
        deleteAdditional();
        setVisible(false);
    }
    useEffect(() => {
        if (values.done) {
            props.history.push({
                pathname: `/staff/dashboard/policies/general/motor/details/${motorPolicy.id}`,
                state: { motorPolicy }
            })
        }
    })
    return (
        <Container>
            <Grid container padded>
                <Grid.Column>
                    <div className="content-wrapper">
                        <Header as='h2'>
                            <Icon name='settings' />
                            <Header.Content>
                                <a href="/staff/dashboard/policies">Policy Records</a> {'>'} <a href="/staff/dashboard/policies/general">General</a> {'>'} <a href="/staff/dashboard/policies/general/motor">Motor</a> {'>'} <Link to={`/staff/dashboard/policies/general/motor/details/${policyId}`}> Policy </Link> {'>'} Edit Motor Policy
                <Header.Subheader>
                                    Fill in this form to create motor policy
                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </div>
                </Grid.Column>
            </Grid>

            <Grid container padded>
                {values.id && <Grid.Column>
                    <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                        <Form.Group>
                            <Message visible={!!errors.errors.length || visible} warning>
                                <Message.Header>Please correct the following issues:</Message.Header>
                                {!!responseErrors.length && <Message>{responseErrors}</Message>}
                                {<Message.List items={errors.errors} />}
                            </Message>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required error={errors.errorPaths.includes('individualClient')}>
                                <label>Client</label>
                                {clients && <Clients
                                    clients={clients}
                                    selected={values.individualClient}
                                    handleOnClientSearch={handleOnClientSearch}
                                    handleOnClientChange={handleOnClientChange}
                                />}
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('policyNo')}>
                                <label>Policy Number</label>
                                <Input fluid placeholder='Policy Number'
                                    name="policyNo" onChange={onChange}
                                    value={values.policyNo} />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('debitNoteNo')}>
                                <label>Debit Note Number</label>
                                <Input fluid placeholder='Debit Note Number'
                                    name="debitNoteNo" onChange={onChange}
                                    value={values.debitNoteNo}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required error={errors.errorPaths.includes('insuranceCompany')}>
                                <label>Insurance Company</label>
                                {insuranceCos && <InsuranceCompanies
                                    insuranceCompanies={insuranceCos}
                                    selected={values.insuranceCompany}
                                    handleOnInsuranceCompChange={handleOnInsuranceCompChange}
                                />}
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('transactionType')}>
                                <label>Transaction Type</label>
                                {policyOpts && policyOpts.transaction_type_options && <TransactionTypes
                                    transactionTypes={policyOpts.transaction_type_options}
                                    selected={values.transactionType}
                                    handleOnTransactionTypesChange={handleOnTransactionTypesChange}
                                />}
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('insuranceClass')}>
                                <label>Insurance Class</label>
                                {policyOpts && policyOpts.insurance_class_options && <PremiumTypes
                                    premiumTypes={policyOpts.insurance_class_options}
                                    placeholder="Select Insurance Class"
                                    selected={values.insuranceClass}
                                    handleOnPremiumTypesChange={handleOnInsuranceClassChange}
                                />}
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required error={errors.errorPaths.includes('transactionDate')}>
                                <label>Transaction Date</label>
                                <Input fluid placeholder='Transaction Date'
                                    name="transactionDate" type="date" onChange={onChange}
                                    value={values.transactionDate} />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('startDate')}>
                                <label>Start Date</label>
                                <Input fluid placeholder='Start Date'
                                    name="startDate" type="date" onChange={onChange}
                                    value={values.startDate} />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('endDate')}>
                                <label>End Date</label>
                                <Input fluid placeholder='End Date'
                                    name="endDate" type="date" onChange={onChange}
                                    value={values.endDate} />
                            </Form.Field>
                        </Form.Group>
                        <Divider horizontal>Vehicle Details</Divider>
                        <Form.Group widths='equal'>
                            <Form.Field required error={errors.errorPaths.includes('value')}>
                                <label>Value</label>
                                <Input fluid placeholder='Current Value'
                                    name="value" type="number" onChange={onChange}
                                    value={values.value} />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('registrationNo')}>
                                <label>Registration Number</label>
                                <Input fluid placeholder='Registration Number'
                                    name="registrationNo" onChange={onChange}
                                    value={values.registrationNo} />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('make')}>
                                <label>Make</label>
                                <Input fluid placeholder='Make'
                                    name="make" onChange={onChange}
                                    value={values.make} />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required error={errors.errorPaths.includes('model')}>
                                <label>Model</label>
                                <Input fluid placeholder='Model'
                                    name="model" onChange={onChange}
                                    value={values.model} />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('body')}>
                                <label>Body</label>
                                <Input fluid placeholder='Body'
                                    name="body" onChange={onChange}
                                    value={values.body} />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('color')}>
                                <label>Color</label>
                                <Input fluid placeholder='Color'
                                    name="color" onChange={onChange}
                                    value={values.color} />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required error={errors.errorPaths.includes('chassisNo')}>
                                <label>Chassis Number</label>
                                <Input fluid placeholder='Chassis Number'
                                    name="chassisNo" onChange={onChange}
                                    value={values.chassisNo} />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('cc')}>
                                <label>CC</label>
                                <Input fluid placeholder='CC'
                                    name="cc" type="number" onChange={onChange}
                                    value={values.cc} />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('engineNo')}>
                                <label>Engine Number</label>
                                <Input fluid placeholder='Engine Number'
                                    name="engineNo" onChange={onChange}
                                    value={values.engineNo} />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required error={errors.errorPaths.includes('seatingCapacity')}>
                                <label>Seat Capacity</label>
                                <Input fluid placeholder='Seat Capacity'
                                    name="seatingCapacity" type="number" onChange={onChange}
                                    value={values.seatingCapacity} />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('tonnage')}>
                                <label>Tonnage</label>
                                <Input fluid placeholder='Tonnage'
                                    name="tonnage" type="number" onChange={onChange}
                                    value={values.tonnage} />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('yearOfManufacture')}>
                                <label>Year of Manufacture</label>
                                <Input fluid placeholder='Year of Manufacture'
                                    name="yearOfManufacture" type="number" onChange={onChange}
                                    value={values.yearOfManufacture} />
                            </Form.Field>
                        </Form.Group>
                        <Divider horizontal>Basic Premiums Details</Divider>
                        <Form.Group widths='equal'>
                            <Form.Field required error={errors.errorPaths.includes('premiumType')}>
                                <label>Premium Type</label>
                                {policyOpts && policyOpts.premium_type_options && <PremiumTypes
                                    premiumTypes={policyOpts.premium_type_options}
                                    selected={values.premiumType}
                                    handleOnPremiumTypesChange={handleOnPremiumTypesChange}
                                />}
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('minimumPremiumAmount')}>
                                <label>Minimum Premium Amount</label>
                                <Input fluid placeholder='Minimum Premium Amount'
                                    name="minimumPremiumAmount" type="number"
                                    onChange={onChange}
                                    value={values.minimumPremiumAmount} />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('commissionRate')}>
                                <label>Commission Rate</label>
                                <Input fluid placeholder='Commission Rate'
                                    name="commissionRate"
                                    type="number" step="any"
                                    onChange={onChange}
                                    value={values.commissionRate} />
                            </Form.Field>
                        </Form.Group>
                        <Divider horizontal>Additional Premiums</Divider>
                        < Form.Group widths='equal'>
                            <Form.Field>
                                <Button icon floated='right' onClick={handleAddAdditionalPremium}>
                                    <Icon name='plus square outline' />
                                </Button>
                            </Form.Field>
                        </Form.Group>
                        {addPremiumCount.map(key => (<Form.Group widths='equal' key={key}>
                            <Form.Field>
                                <label>Additional Premium Type</label>
                                {policyOpts && policyOpts.premium_type_options && <PremiumTypes
                                    premiumTypes={policyOpts.premium_type_options}
                                    id={key}
                                    selected={addPremiums[key] && addPremiums[key].premium}
                                    handleOnPremiumTypesChange={handleOnAddPremTypesChange}
                                />}
                            </Form.Field>
                            <Form.Field>
                                <label>Minimum Premium Amount</label>
                                <Input fluid placeholder='Minimum Premium Amount'
                                    name="minimumAmount" type="number"
                                    id={key}
                                    onChange={handleOnAddPremTypesChange}
                                    value={addPremiums[key] && addPremiums[key].minimumAmount ? addPremiums[key].minimumAmount : ''} />
                            </Form.Field>
                            <Form.Field>
                                <Grid>
                                    <label><b>Commission Rate</b></label>
                                    <Grid.Column width={12}>
                                        <Input fluid placeholder='Commission Rate'
                                            name="commissionRate"
                                            type="number" step="any"
                                            id={key}
                                            onChange={handleOnAddPremTypesChange}
                                            value={addPremiums[key] && addPremiums[key].commissionRate ? addPremiums[key].commissionRate : ''} />
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Button id={key} key={key} icon floated='right' onClick={handleRemoveAdditionalPremium} size="small">
                                            <Icon name='trash alternate' id={key} key={key} />
                                        </Button>
                                    </Grid.Column>
                                </Grid>
                            </Form.Field>
                        </Form.Group>))}
                        <Divider horizontal>Additional Benefits</Divider>

                        < Form.Group widths='equal'>
                            <Form.Field>
                                <Button icon floated='right' onClick={handleAddAdditionalBenefit}>
                                    <Icon name='plus square outline' />
                                </Button>
                            </Form.Field>
                        </Form.Group>
                        {addBenefitCount.map(key => (
                            < Form.Group widths='equal' key={key}>
                                <Form.Field>
                                    <label>Additional Benefit Type</label>
                                    {policyOpts && policyOpts.additional_benefit_options && <PremiumTypes
                                        premiumTypes={policyOpts.additional_benefit_options}
                                        placeholder='Select Additional Benefit Type'
                                        id={key}
                                        selected={addBenefits[key] ? addBenefits[key].benefit : ""}
                                        handleOnPremiumTypesChange={handleOnAddBenefitTypesChange}
                                    />}
                                </Form.Field>
                                <Form.Field>
                                    <label>Minimum Benefit Amount</label>
                                    <Input fluid placeholder='Minimum Additional Benefit Amount'
                                        id={key}
                                        name="minimumAmount" type="number"
                                        onChange={handleOnAddBenefitTypesChange}

                                        value={addBenefits[key] && addBenefits[key].minimumAmount ? addBenefits[key].minimumAmount : ""} />
                                </Form.Field>
                                <Form.Field>

                                    <Grid>
                                        <label><b>Commission Rate</b></label>
                                        <Grid.Column width={12}>
                                            <Input fluid placeholder='Commission Rate'
                                                name="commissionRate"
                                                type="number" step="any"
                                                id={key}
                                                onChange={handleOnAddBenefitTypesChange}
                                                value={addBenefits[key] && addBenefits[key].commissionRate ? addBenefits[key].commissionRate : ""} />
                                        </Grid.Column>
                                        <Grid.Column width={4}>
                                            <Button id={key} key={key} icon floated='right' onClick={handleRemoveAdditionalBenefit} size="small">
                                                <Icon name='trash alternate' id={key} key={key} />
                                            </Button>
                                        </Grid.Column>
                                    </Grid>
                                </Form.Field>
                            </Form.Group>))}

                        <Divider horizontal>Remarks</Divider>
                        <CKEditor
                            editor={ClassicEditor}
                            data={values.remarks}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setValues({ ...values, remarks: data });
                            }} />
                        <Divider horizontal>...</Divider>
                        <Button type='submit'>Edit Motor Policy</Button>

                    </Form>
                </Grid.Column>
                }
            </Grid>
        </Container >
    )
}
