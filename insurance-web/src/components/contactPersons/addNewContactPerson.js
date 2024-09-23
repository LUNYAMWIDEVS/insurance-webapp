import { useMutation, useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import { useHistory } from 'react-router-dom';
import { DateInput } from 'semantic-ui-calendar-react';
import {
    Button,
    Container,
    Dropdown,
    Form,
    Grid,
    Header,
    Icon,
    Message
} from 'semantic-ui-react';
import * as yup from "yup";
import { AuthContext } from '../../context/auth';
import { ContactPersonContext } from '../../context/contactPerson';
import { FETCH_CLIENTS_QUERY, GET_CORPORATE_CLIENTS } from '../clients/queries';
import Clients from '../contactPersons/listContacts';
import IndividualClients from '../policies/listClients';
import { ADD_NEW_CONTACT_PERSON } from './queries';

function AddNewContactPerson({ props }) {
    const authContext = useContext(AuthContext);
    let history = useHistory();

    const [errors, setErrors] = useState({
        errorPaths: [],
        errors: []
    });
    const context = useContext(ContactPersonContext);
    const [successMsg, setSuccessMsg] = useState();
    const [corporateClients, setCorporateClients] = useState();
    const [individualClients, setIndividualClients] = useState();
    const [search, setSearch] = useState({ search: "" });
    const [responseErrors, setResponseErrors] = useState([]);


    const [values, setValues] = useState({
        updated: true,
        afterSubmit: false,
        individualClients: [],
        corporateClients: []
    });
    let schema = yup.object().shape({
        email: yup.string().required("Please provide an email address"),
        name: yup.string().required("Please provide the name"),
        // client: yup.string().required("Please  select the client"),
        phoneNumber: yup.string().required("Please provide a phone number"),
        position: yup.string().required("Please provide the position"),
        serviceLine: yup.string().required("Please provide the service line"),
        town: yup.string().required("Please provide the town of residence"),
        dateOfBirth: yup.date().required("Please input the date of birth"),
        gender: yup.string().required("Please select the gender"),
    });


    const { data: corporateClientsData } = useQuery(GET_CORPORATE_CLIENTS, {
        variables: search
    });
    const { data: individualClientsData } = useQuery(FETCH_CLIENTS_QUERY, {
        variables: search
    });
    useEffect(() => {

        if (corporateClientsData) {
            setCorporateClients(corporateClientsData.corporateClients.items);
        }
        if (individualClientsData) {
            setIndividualClients(individualClientsData.individualClients.items);
        }
    }, [corporateClientsData, individualClientsData]);

    const [addContactPerson, { loading }] = useCallback(useMutation(ADD_NEW_CONTACT_PERSON, {
        update(_, result) {
            context.registerContactPerson(result.data);
            setVisible(false);
            const contactData = result.data.createContactPerson.contactPerson
            history.push({
                pathname: `/staff/dashboard/contact-person/profile/${contactData.id}`,
                state: { user: contactData }
            })
        },
        onError(err) {
            try {
                console.log(err.graphQLErrors && err.graphQLErrors[0] ? err.graphQLErrors[0].message : err.networkError && err.networkError.result ? err.networkError.result.errors : err)

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
        variables: values
    }));

    const validate = useCallback((values) => {
        schema.validate(values, { abortEarly: false })
            .then(valid => setErrors({ errorPaths: [], errors: [] })) //called if the entire form is valid
            .catch(err => {
                setErrors({ errors: err.errors, errorPaths: err.inner.map(i => i.path) })
            })
    }, [schema])

    useEffect(() => {
        if (values.updated) {
            setValues({ ...values, updated: false })
            if (values.afterSubmit) {
                validate(values)
            }
        }
    }, [values, validate])
    const handleOnGenderChange = (e, { value }) => {
        e.preventDefault()
        setValues({ ...values, gender: value, updated: true });
    }
    const handleOnClientSearch = (e) => {
        setSearch({ search: e.target.value });
    }
    const handleOnClientChange = (e, { value }) => {
        e.preventDefault()
        setValues({ ...values, individualClients: value, updated: true });
    }
    const handleOnCorporateClientChange = (e, { value }) => {
        e.preventDefault()
        setValues({ ...values, corporateClients: value, updated: true });
    }

    const onChange = useCallback((event, { name, value }) => {
        setValues({ ...values, [name]: value, updated: true });
    }, [values])
    const [visible, setVisible] = useState(false);

    const handleDismiss = () => {
        setVisible(false);
        setSuccessMsg('');
    }
    const genderOptions = [
        {
            key: 'F',
            text: 'Female',
            value: 'F',
        },
        {
            key: 'M',
            text: 'Male',
            value: 'M',
        },
        {
            key: 'O',
            text: 'Other',
            value: 'O',
        }
    ]
    const onPhoneNumberChange = useCallback((value) => {
        setValues({ ...values, phoneNumber: "+" + value, updated: true });
    }, [values])

    const onSubmit = (event) => {
        event.preventDefault();
        setSuccessMsg('');
        validate(values)
        setValues({ ...values, afterSubmit: true })
        if (Object.keys(values).length > 7 && !errors.errors.length) { addContactPerson() }
        setVisible(false);
        console.log("errors", errors)
    }
    return (
        <Container>
            <Grid container padded>
                <Grid.Column>
                    <div className="content-wrapper">
                        <Header as='h2'>
                            <Icon name='settings' />
                            <Header.Content>
                                <a href="/staff/dashboard/contact-person-records">Contact Person Records</a> {'>'} Register Contact Person
                <Header.Subheader>
                                    Hello {authContext.user.username}, Fill in this form to register a new contact person
                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </div>
                </Grid.Column>
            </Grid>

            <Grid container padded>
                <Grid.Column>
                    {successMsg ?
                        <Message
                            positive
                            onDismiss={handleDismiss}
                            header='status'
                            content={successMsg} /> :
                        ''}

                    <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                        <Form.Group>
                            <Message visible={!!errors.errors.length || visible} warning>
                                <Message.Header>Please correct the following issues:</Message.Header>
                                {!!responseErrors.length && <Message>{responseErrors}</Message>}
                                {<Message.List items={errors.errors} />}
                            </Message>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required error={errors.errorPaths.includes('name')}>
                                <label>Name</label>
                                <Form.Input fluid placeholder='Name'
                                    name='name'
                                    onChange={onChange}

                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Postal Address</label>
                                <Form.Input fluid placeholder='Post Address'
                                    name='postalAddress'
                                    onChange={onChange}
                                />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('serviceLine')}>
                                <label>Service Line</label>
                                <Form.Input fluid placeholder='service Line'
                                    name='serviceLine'
                                    onChange={onChange}

                                />
                            </Form.Field>


                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required error={errors.errorPaths.includes('position')}>
                                <label>Position</label>
                                <Form.Input fluid placeholder='Position'
                                    name='position'
                                    onChange={onChange}

                                />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('phoneNumber')}>
                                <PhoneInput
                                    inputExtraProps={{
                                        name: "phoneNumber",
                                        required: true,
                                        autoFocus: true,
                                        enableSearch: true
                                    }}
                                    style={{ fontWeight: "bold" }}
                                    name='phoneNumber'
                                    specialLabel='Phone Number *'
                                    country={"ke"}
                                    value={values.phoneNumber}
                                    onChange={onPhoneNumberChange}
                                />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('town')}>
                                <label>Residence (Town)</label>
                                <Form.Input
                                    fluid placeholder='Residence (Town)'
                                    name='town'
                                    onChange={onChange}

                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field error={errors.errorPaths.includes('corporateClients')}>
                                <label>Corporate Client</label>
                                {corporateClients && <Clients
                                    clients={corporateClients}
                                    multiple={true}
                                    handleOnClientSearch={handleOnClientSearch}
                                    handleOnClientChange={handleOnCorporateClientChange}
                                />}
                            </Form.Field>
                            <Form.Field error={errors.errorPaths.includes('individualClients')}>
                                <label>Individual Client</label>
                                {individualClients && <IndividualClients
                                    clients={individualClients}
                                    multiple={true}
                                    handleOnClientSearch={handleOnClientSearch}
                                    handleOnClientChange={handleOnClientChange}
                                />}
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required error={errors.errorPaths.includes('email')}>
                                <label>Email Address</label>
                                <Form.Input fluid placeholder='Email Address'
                                    name='email'
                                    type="email"
                                    onChange={onChange}

                                />
                            </Form.Field>
                            <Form.Field required error={errors.errorPaths.includes('gender')}>
                                <label>Gender</label>
                                <Dropdown
                                    placeholder='Select Gender'
                                    fluid
                                    selection
                                    onChange={handleOnGenderChange}
                                    options={genderOptions}
                                />
                            </Form.Field>

                            <Form.Field required error={errors.errorPaths.includes('dateOfBirth')}>
                                <label>Date Of Birth</label>

                                <DateInput
                                    name="dateOfBirth"
                                    placeholder="Date Of Birth"
                                    autoComplete="off"
                                    popupPosition="bottom left"
                                    value={values.dateOfBirth ? values.dateOfBirth : ""}
                                    iconPosition="left"
                                    dateFormat="YYYY-MM-DD"
                                    maxDate={moment()}
                                    onChange={onChange}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Button type='submit'>Register Contact Person</Button>

                    </Form>
                </Grid.Column>
            </Grid>
        </Container>
    )
}

export default AddNewContactPerson;