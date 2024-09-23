import React, { useState, useContext, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import {
  Grid,
  Container,
  Header,
  Icon,
  Form,
  Button,
  Divider,
  Tab,
  Message,
  Menu,
  Segment,
  Radio,
} from "semantic-ui-react";
import Clients from "../policies/listClients";
import Contacts from "../clients/listContactPersons.js";
import { GET_CONTACT_PERSONS } from "../contactPersons/queries";
import { AuthContext } from "../../context/auth";

import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { MessageContext } from "../../context/messages.js";
import { FETCH_CLIENTS_QUERY, GET_CORPORATE_CLIENTS } from "../clients/queries";
import * as yup from "yup";
import { SEND_MULTIPLE_WHATSAPP_MESSAGES } from "./queries";

export default function SendMultipleWhatsappMessages(props) {
  let history = useHistory();
  const [errors, setErrors] = useState({
    errorPaths: [],
    errors: [],
  });
  const [responseErrors, setResponseErrors] = useState([]);
  const context = useContext(MessageContext);
  const authContext = useContext(AuthContext);
  const [clients, setClients] = useState();
  const [contacts, setContacts] = useState();
  const [corporateClients, setCorporateClients] = useState();

  const [visible, setVisible] = useState(false);

  const [search, setSearch] = useState({ search: "" });
  const [searchCorporate, setSearchCorporate] = useState({ search: "" });
  const [usersFetched, setUsersFetched] = useState(false);
  const [values, setValues] = useState({
    messageOption: "S",
    afterSubmit: false,
    messageOptUpdated: false,
    allIndividual: false,
    allCorporate: false,
    allContactPersons: false,
    individualClients: [],
    contactPersons: [],
    corporateClients: [],
  });

  let schema = yup.object().shape({
    individualClient: yup.string().required(""),
    contactPersons: yup.string().required(""),
  });

  const { data: corporateClientsData } = useQuery(GET_CORPORATE_CLIENTS, {
    variables: searchCorporate,
  });
  useEffect(() => {
    if (corporateClientsData) {
      setCorporateClients(corporateClientsData.corporateClients.items);
    }
  }, [corporateClientsData]);

  const onChange = useCallback(
    (event, { name, value }) => {
      setValues({ ...values, [name]: value, updated: true });
    },
    [values]
  );
  const setMessageOps = useCallback(() => {
    const users = [
      ...values.individualClients,
      ...values.corporateClients,
      ...values.contactPersons,
    ];
    if (users.length < 2) {
      setValues({ ...values, messageOption: "S", messageOptUpdated: false });
    } else {
      setValues({ ...values, messageOption: "M", messageOptUpdated: false });
    }
  }, [values]);
  const onCheckbox = useCallback(
    (event, { name, value }) => {
      if (value === "allIndividual") {
        if (values.messageOption !== "AI") {
          setValues({
            ...values,
            [value]: !values[value],
            updated: true,
            messageOption: "AI",
            allContactPersons: false,
            allCorporate: false,
            allClients: false,
          });
        } else {
          setValues({
            ...values,
            [value]: !values[value],
            updated: true,
            messageOptUpdated: true,
          });
        }
      }
      if (value === "allContactPersons") {
        if (values.messageOption !== "ACP") {
          setValues({
            ...values,
            [value]: !values[value],
            updated: true,
            messageOption: "ACP",
            allIndividual: false,
            allCorporate: false,
            allClients: false,
          });
        } else {
          setValues({
            ...values,
            [value]: !values[value],
            messageOptUpdated: true,
            updated: true,
          });
        }
      }
      if (value === "allCorporate") {
        if (values.messageOption !== "AC") {
          setValues({
            ...values,
            [value]: !values[value],
            updated: true,
            messageOption: "AC",
            allContactPersons: false,
            allIndividual: false,
            allClients: false,
          });
        } else {
          setValues({
            ...values,
            [value]: !values[value],
            messageOptUpdated: true,
            updated: true,
          });
        }
      }
      if (value === "allClients") {
        if (values.messageOption !== "A") {
          setValues({
            ...values,
            [value]: !values[value],
            updated: true,
            messageOption: "A",
            allContactPersons: false,
            allIndividual: false,
            allCorporate: false,
          });
        } else {
          setValues({
            ...values,
            [value]: !values[value],
            messageOptUpdated: true,
            updated: true,
          });
        }
      }
    },
    [values]
  );

  const anyAll =
    [
      values.allContactPersons,
      values.allCorporate,
      values.allIndividual,
      values.allClients,
    ].filter(Boolean).length > 0;

  const [fetchClients, { data: clientsData }] = useLazyQuery(
    FETCH_CLIENTS_QUERY,
    {
      variables: search,
    }
  );
  useEffect(() => {
    if (!usersFetched) {
      fetchClients();
    }
    if (clientsData) {
      setClients(clientsData.individualClients.items);
      setUsersFetched(true);
    }
  }, [clientsData, clients, fetchClients, usersFetched]);

  const [fetchContacts, { data: contactsData }] = useLazyQuery(
    GET_CONTACT_PERSONS,
    {
      variables: search,
    }
  );

  useEffect(() => {
    if (!usersFetched) {
      fetchContacts();
    }

    if (contactsData) {
      setContacts(contactsData.contactPersons.items);
      setUsersFetched(true);
    }
  }, [contactsData, contacts, fetchContacts, usersFetched]);

  const validate = useCallback(
    (values) => {
      schema
        .validate(values, { abortEarly: false })
        .then((valid) => setErrors({ errorPaths: [], errors: [] })) //called if the entire form is valid
        .catch((err) => {
          setErrors({
            errors: err.errors,
            errorPaths: err.inner.map((i) => i.path),
          });
        });
    },
    [schema]
  );

  const [sendMessage, { loading }] = useCallback(
    useMutation(SEND_MULTIPLE_WHATSAPP_MESSAGES, {
      update(_, result) {
        context.sendMessage(result.data.sendMultipleWhatsappMessages.message);
        history.push({
          pathname: `/staff/dashboard/crm/message/${result.data.sendMultipleWhatsappMessages.message.id}`,
        });
      },
      onError(err) {
        console.log(
          err.graphQLErrors && err.graphQLErrors[0]
            ? err.graphQLErrors[0].message
            : err.networkError && err.networkError.result
            ? err.networkError.result.errors
            : err
        );
        try {
          if (err.graphQLErrors) {
            setResponseErrors(err.graphQLErrors[0].message);
          }

          if (err.networkError !== null && err.networkError !== "undefined") {
            setResponseErrors(err.networkError.result.errors[0]);
          } else if (
            err.graphQLErrors !== null &&
            err.networkError !== "undefined"
          ) {
            setResponseErrors(err.graphQLErrors.result.errors[0]);
          }
        } catch (e) {
          setVisible(true);
        }
      },
      variables: values,
    })
  );

  const handleOnClientSearch = (e) => {
    setSearch({ search: e.target.value });
  };
  const handleOnClientChange = (e, { value }) => {
    e.preventDefault();
    setValues({ ...values, individualClients: value, updated: true });
  };

  // const handleOnContactSearch = (e) => {
  //   setSearch({ search: e.target.value });
  // };
  // const handleOnContactChange = (e, { value }) => {
  //   e.preventDefault();
  //   setValues({ ...values, contactPersons: value, updated: true });
  // };
  const handleOnCorporateSearch = (e) => {
    setSearchCorporate({ search: e.target.value });
  };
  const handleOnCorporateChange = (e, { value }) => {
    e.preventDefault();
    setValues({ ...values, corporateClients: value, updated: true });
  };

  useEffect(() => {
    if (values.updated) {
      setValues({ ...values, updated: false });
      if (values.messageOptUpdated) {
        setMessageOps();
      }
      if (values.afterSubmit) {
        validate(values);
      }
    }
  }, [values, validate, setMessageOps]);
  useEffect(() => {
    if (values.updated) {
      if (
        values.updated &&
        (values.individualClients.length > 1) |
          (values.contactPersons.length > 1) |
          (values.contactPersons.length + values.individualClients.length > 2)
      ) {
        setValues({ ...values, messageOption: "M", updated: false });
      }
    }
  }, [values]);

  const panes = [
    {
      menuItem: <Menu.Item key="clients">Notify</Menu.Item>,
      render: () => {
        return (
          <Tab.Pane>
            <Form noValidate className={loading ? "loading" : ""}>
              <Form.Group>
                <Message visible={!!errors.errors.length || visible} warning>
                  <Message.Header>
                    Please correct the following issues:
                  </Message.Header>
                  {!!responseErrors.length && (
                    <Message>{responseErrors}</Message>
                  )}
                  {<Message.List items={errors.errors} />}
                </Message>
              </Form.Group>
              <Divider horizontal>Send notification options</Divider>
              <Form.Group widths="equal" as={Segment}>
                <Form.Field>
                  <Radio
                    label="Send to all Individual Clients"
                    name="radioGroup"
                    value="allIndividual"
                    toggle
                    checked={values.allIndividual}
                    onChange={onCheckbox}
                  />
                </Form.Field>
                {/* <Form.Field>
                                    <Radio
                                        label='Send to all Contact Persons'
                                        name='radioGroup'
                                        value='allContactPersons'
                                        toggle
                                        checked={values.allContactPersons}
                                        onChange={onCheckbox}
                                    />
                                </Form.Field> */}
                <Form.Field>
                  <Radio
                    label="Send to all Corporate Clients"
                    name="radioGroup"
                    value="allCorporate"
                    toggle
                    checked={values.allCorporate}
                    onChange={onCheckbox}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label="Send to ALL"
                    name="radioGroup"
                    value="allClients"
                    toggle
                    checked={values.allClients}
                    onChange={onCheckbox}
                  />
                </Form.Field>
              </Form.Group>
              {!anyAll && (
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Individual Client(s)</label>
                    {clients && (
                      <Clients
                        clients={clients}
                        multiple={true}
                        handleOnClientSearch={handleOnClientSearch}
                        handleOnClientChange={handleOnClientChange}
                      />
                    )}
                  </Form.Field>
                  <Form.Field>
                    <label>Corporate Client(s)</label>
                    {corporateClients && (
                      <Contacts
                        multiple={true}
                        clients={corporateClients}
                        placeholder="Select Corporate Client"
                        handleOnClientSearch={handleOnCorporateSearch}
                        handleOnClientChange={handleOnCorporateChange}
                      />
                    )}
                  </Form.Field>
                  {/* <Form.Field>
                                    <label>Contact Person(s)</label>
                                    {contacts && <Contacts
                                        multiple={true}
                                        clients={contacts}
                                        handleOnClientSearch={handleOnContactSearch}
                                        handleOnClientChange={handleOnContactChange}
                                    />}
                                </Form.Field> */}
                </Form.Group>
              )}
              <Form.Group widths="equal">
                <Form.Field error={errors.errorPaths.includes("whatsappSms")}>
                  <label>SMS</label>
                  <Form.Input
                    fluid
                    placeholder="Send whatsappSms"
                    name="whatsappSms"
                    onChange={onChange}
                  />
                </Form.Field>
              </Form.Group>

              {/* <b><label>Sms</label></b>
                            <CKEditor
                                editor={ClassicEditor}
                                data={values.whatsappSms}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setValues({ ...values, whatsappSms: data })

                                }} /> */}

              <Divider horizontal>...</Divider>
              <Button
                type="submit"
                positive
                onClick={() => {
                  sendMessage();
                }}
              >
                Send Information
              </Button>
            </Form>
          </Tab.Pane>
        );
      },
    },
  ];

  return (
    <Container>
      <Grid container padded>
        <Grid.Column>
          <div className="content-wrapper">
            <Header as="h2">
              <Icon name="settings" />
              <Header.Content>
                <a href="/staff/dashboard/overview">Overview</a> {">"}{" "}
                <a href="/staff/dashboard/crm"> CRM </a>
                {">"} <a href="/staff/dashboard/crm/messages">Messages</a> {">"}{" "}
                Send Messages
                <Header.Subheader>
                  Hello {authContext.user.username}, Fill in this form to send
                  messages to clients
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>
      </Grid>

      <Grid container padded>
        <Grid.Column>
          <Tab panes={panes} />
        </Grid.Column>
      </Grid>
    </Container>
  );
}
