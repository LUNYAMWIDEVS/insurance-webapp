import { useMutation, useQuery } from "@apollo/react-hooks";
import moment from "moment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useHistory } from "react-router-dom";
import { DateInput } from "semantic-ui-calendar-react";
import {
  Button,
  Container,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Tab,
} from "semantic-ui-react";
import * as yup from "yup";
import { AuthContext } from "../../context/auth";
import { ClientContext } from "../../context/clients";
import { GET_CONTACT_PERSONS } from "../contactPersons/queries";
import Uploadzone from "../policies/upload";
import Contacts from "./listContactPersons";
import {
  ADD_NEW_CLIENT,
  ADD_NEW_CORPORATE_CLIENT,
  GET_STATUS_OPTS,
} from "./queries";
import StatusTypes from "./statusTypes";

function AddNewClient({ props }) {
  const authContext = useContext(AuthContext);
  let history = useHistory();

  const [errors, setErrors] = useState({
    errorPaths: [],
    errors: [],
  });
  const [visible, setVisible] = useState(false);
  const [corporateErrors, setCorporateErrors] = useState({
    errorPaths: [],
    errors: [],
  });
  const context = useContext(ClientContext);
  const [successMsg, setSuccessMsg] = useState();
  const [responseErrors, setResponseErrors] = useState([]);
  const [statusOpts, setStatusOpts] = useState();
  const [contactPersonsExtras, setContactPersonsExtras] = useState({
    search: "",
    page: 1,
    limit: 10,
  });
  const [contactPersons, setContactPersons] = useState({});
  const [corporateResponseErrors, setCorporateResponseErrors] = useState([]);

  const [values, setValues] = useState({
    updated: true,
    afterLoop: false,
    afterSubmit: false,
    contactPersons: [],
  });
  const [corporateValues, setCorporateValues] = useState({
    updated: true,
    contactPersons: [],
    afterSubmit: false,
  });
  let schema = yup.object().shape({
    email: yup
      .string()
      .email("please enter a valid email")
      .required("Please provide an email"),
    firstName: yup.string().required("Please provide the first name"),
    lastName: yup.string().required("Please provide the middle name"),
    phoneNumber: yup.string().required("Please provide a phone number"),
    town: yup.string().required("Please provide the town of residence"),
    status: yup.string().required("Please indicate status of client"),
    surname: yup.string().required("Please provide the surname"),
    dateOfBirth: yup.date().required("Please select the date of birth"),
    gender: yup.string().required("Please select the gender"),
    idNumber: yup.number().required("Please provide the ID number"),
    kraPin: yup
      .string()
      .required("Please provide the KRA pin")
      .matches(/((\d+[A-Z])|([A-Z]+\d)[\dA-Z]*)/, {
        excludeEmptyString: true,
        message: "Enter a valid KRA pin",
      }),
  });
  let corporateSchema = yup.object().shape({
    name: yup.string().required("Please provide a name"),
    status: yup.string().required("Please client status"),
    email: yup.string().required("Please provide an email"),
    postalAddress: yup.string().required("Please provide a postal address"),
    phoneNumber: yup.string().required("Please provide a phone number"),
    town: yup.string().required("Please provide the town of residence"),
    about: yup.string().required("Please provide the about"),
    kraPin: yup.string().matches(/((\d+[A-Z])|([A-Z]+\d)[\dA-Z]*)/, {
      excludeEmptyString: true,
      message: "Enter a valid KRA pin",
    }),
    facebookAccount: yup
      .string()
      .matches(
        /^(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w-]*)?/,
        { excludeEmptyString: true, message: "Enter a valid Facebook URL" }
      ),
    // instagramAccount: yup.string().matches(/^(?:(?:http|https):\/\/)?(?:www.)?instagram.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w-]*)?/, { excludeEmptyString: true, message: "Enter a valid Instagram URL" }),
    // twitterAccount: yup.string().matches(/^(?:(?:http|https):\/\/)?(?:www.)?twitter.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w-]*)?/, { excludeEmptyString: true, message: "Enter a valid Twitter URL" }),
    // linkedinAccount: yup.string().matches(/^https?://((www|\w\w)\.)?linkedin.com/((in/[^/]+/?)|(pub/[^/]+/((\w|\d)+/?){3}))$/, { excludeEmptyString: true, message: "Enter a valid LinkedIn URL" }),
  });

  const { data: statusOptsData } = useQuery(GET_STATUS_OPTS);
  useEffect(() => {
    if (statusOptsData) {
      setStatusOpts(statusOptsData.clientStatusOptions);
    }
  }, [statusOptsData, statusOpts]);

  const { data: contactPersonsData } = useQuery(GET_CONTACT_PERSONS, {
    variables: contactPersonsExtras,
  });
  useEffect(() => {
    if (contactPersonsData) {
      setContactPersons(contactPersonsData.contactPersons);
    }
  }, [contactPersonsData]);

  const [addCorporateClient] = useCallback(
    useMutation(ADD_NEW_CORPORATE_CLIENT, {
      update(_, result) {
        setVisible(false);
        let clientData = result.data.createCorporateClient.corporateClient;
        history.push({
          pathname: `/staff/dashboard/corporate-client/profile/${clientData.id}`,
          state: { corporateClient: clientData, clientId: clientData.id },
        });

        setSuccessMsg("Successfully Registered New Client");
      },
      onError(err) {
        try {
          if (err.graphQLErrors) {
            setCorporateResponseErrors(err.graphQLErrors[0].message);
          }

          if (err.networkError !== null && err.networkError !== "undefined") {
            setCorporateResponseErrors(err.networkError.result.errors[0]);
          } else if (
            err.graphQLErrors !== null &&
            err.networkError !== "undefined"
          ) {
            setCorporateResponseErrors(err.graphQLErrors.result.errors[0]);
          }
        } catch (e) {
          setVisible(true);
        }
      },
      variables: corporateValues,
    })
  );

  const [addClient, { loading }] = useCallback(
    useMutation(ADD_NEW_CLIENT, {
      update(_, result) {
        context.registerClient(result.data);
        setVisible(false);
        let clientData = result.data.createIndividualClient.individualClient;
        history.push({
          pathname: `/staff/dashboard/clients/profile/${clientData.id}`,
          state: { user: clientData, userId: clientData.id },
        });

        setSuccessMsg("Successfully Registered New Client");
      },
      onError(err) {
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
      variables: values, //c variables: {firstNamne: "", lastName: ""}
    })
  );

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

  const validateCorporate = useCallback(() => {
    corporateSchema
      .validate(corporateValues, { abortEarly: false })
      .then((valid) => setCorporateErrors({ errorPaths: [], errors: [] })) //called if the entire form is valid
      .catch((err) => {
        setCorporateErrors({
          errors: err.errors,
          errorPaths: err.inner.map((i) => i.path),
        });
      });
  }, [corporateSchema, corporateValues]);

  useEffect(() => {
    if (values.updated) {
      setValues({ ...values, updated: false });
      if (values.afterSubmit) {
        validate(values);
      }
    }
    if (corporateValues.updated) {
      setCorporateValues({ ...corporateValues, updated: false });
      if (corporateValues.afterSubmit) {
        validateCorporate();
      }
    }
  }, [values, validate, corporateValues, validateCorporate]);
  const handleOnGenderChange = (e, { value }) => {
    e.preventDefault();
    setValues({ ...values, gender: value, updated: true });
  };
  const onChange = useCallback(
    (event, { name, value }) => {
      setValues({ ...values, [name]: value, updated: true });
    },
    [values]
  );
  const onCorporateChange = useCallback(
    (event, { name, value }) => {
      setCorporateValues({ ...corporateValues, [name]: value, updated: true });
    },
    [corporateValues]
  );

  const handleOnContactSearch = (e) => {
    setContactPersonsExtras({
      ...contactPersonsExtras,
      search: e.target.value,
    });
  };
  const handleOnContactChange = (e, { value }) => {
    e.preventDefault();
    setValues({ ...values, contactPersons: value, updated: true });
  };
  const handleOnCorporateContactChange = (e, { value }) => {
    e.preventDefault();
    setCorporateValues({
      ...corporateValues,
      contactPersons: value,
      updated: true,
    });
  };

  const handleOnStatusTypesChange = (e, { value }) => {
    e.preventDefault();
    setValues({ ...values, status: value, updated: true });
  };

  const handleOnCorporateStatusTypesChange = (e, { value }) => {
    e.preventDefault();
    setCorporateValues({ ...corporateValues, status: value, updated: true });
  };

  const handleDismiss = () => {
    setVisible(false);
    setSuccessMsg("");
  };
  const onPhoneNumberChange = useCallback(
    (value) => {
      setValues({ ...values, phoneNumber: "+" + value, updated: true });
    },
    [values]
  );
  const onCorporatePhoneNumberChange = useCallback(
    (value) => {
      setCorporateValues({
        ...corporateValues,
        phoneNumber: "+" + value,
        updated: true,
      });
    },
    [corporateValues]
  );
  const genderOptions = [
    {
      key: "F",
      text: "Female",
      value: "F",
    },
    {
      key: "M",
      text: "Male",
      value: "M",
    },
    {
      key: "O",
      text: "Other",
      value: "O",
    },
  ];
  const onSubmit = (event) => {
    event.preventDefault();
    setSuccessMsg("");
    validate(values);
    setValues({ ...values, afterSubmit: true });
    if (Object.keys(values).length > 7 && !errors.errors.length) {
      addClient();
    }
    setVisible(false);
  };

  const onCorporateSubmit = (event) => {
    event.preventDefault();
    setSuccessMsg("");
    validateCorporate();
    setCorporateValues({ ...corporateValues, afterSubmit: true });
    if (
      Object.keys(corporateValues).length > 5 &&
      !corporateErrors.errors.length
    ) {
      addCorporateClient();
    }
    setVisible(false);
  };
  const panes = [
    {
      menuItem: "Corporate Client",
      render: () => (
        <Grid.Column>
          {successMsg ? (
            <Message
              positive
              onDismiss={handleDismiss}
              header="status"
              content={successMsg}
            />
          ) : (
            ""
          )}

          <Form
            onSubmit={onCorporateSubmit}
            noValidate
            className={loading ? "loading" : ""}
          >
            <Form.Group>
              <Message
                visible={!!corporateErrors.errors.length || visible}
                warning
              >
                <Message.Header>
                  Please correct the following issues:
                </Message.Header>
                {!!corporateResponseErrors.length && (
                  <Message>{corporateResponseErrors}</Message>
                )}
                {<Message.List items={corporateErrors.errors} />}
              </Message>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                required
                error={corporateErrors.errorPaths.includes("name")}
              >
                <label>Name</label>
                <Form.Input
                  fluid
                  placeholder="Name"
                  name="name"
                  onChange={onCorporateChange}
                />
              </Form.Field>
              <Form.Field
                required={corporateValues.status === "P" ? false : true}
                error={corporateErrors.errorPaths.includes("email")}
              >
                <label>Email</label>
                <Form.Input
                  fluid
                  placeholder="email"
                  name="email"
                  onChange={onCorporateChange}
                />
              </Form.Field>
              <Form.Field
                required
                error={corporateErrors.errorPaths.includes("postalAddress")}
              >
                <label>Postal Address</label>
                <Form.Input
                  fluid
                  placeholder="Post Address"
                  name="postalAddress"
                  onChange={onCorporateChange}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field error={corporateErrors.errorPaths.includes("kraPin")}>
                <label>KRA PIN Number</label>
                <Form.Input
                  fluid
                  placeholder="KRA PIN Number"
                  name="kraPin"
                  onChange={onCorporateChange}
                />
              </Form.Field>
              <Form.Field
                required={corporateValues.status === "P" ? false : true}
                error={corporateErrors.errorPaths.includes("phoneNumber")}
              >
                <PhoneInput
                  inputExtraProps={{
                    name: "phoneNumber",
                    required: true,
                    autoFocus: true,
                    enableSearch: true,
                  }}
                  style={{ fontWeight: "bold" }}
                  name="phoneNumber"
                  specialLabel="Phone Number *"
                  country={"ke"}
                  value={corporateValues.phoneNumber}
                  onChange={onCorporatePhoneNumberChange}
                />
              </Form.Field>
              <Form.Field
                required
                error={corporateErrors.errorPaths.includes("town")}
              >
                <label>Town</label>
                <Form.Input
                  fluid
                  placeholder="Town"
                  name="town"
                  onChange={onCorporateChange}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                required
                error={corporateErrors.errorPaths.includes("about")}
              >
                <label>About</label>
                <Form.TextArea
                  required
                  placeholder="About the corporate client"
                  name="about"
                  onChange={onCorporateChange}
                />
              </Form.Field>
              {contactPersons.items && (
                <Form.Field>
                  <label>Contact Person(s)</label>
                  <Contacts
                    multiple={true}
                    clients={contactPersons.items}
                    handleOnClientSearch={handleOnContactSearch}
                    handleOnClientChange={handleOnCorporateContactChange}
                  />
                </Form.Field>
              )}
              <Form.Field
                required
                error={corporateErrors.errorPaths.includes("status")}
              >
                <label>Client Status</label>
                {statusOpts && statusOpts.statusOptions && (
                  <StatusTypes
                    statusTypes={statusOpts.statusOptions}
                    handleOnStatusTypesChange={
                      handleOnCorporateStatusTypesChange
                    }
                  />
                )}
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                error={corporateErrors.errorPaths.includes("facebookAccount")}
              >
                <label>Facebook Link</label>
                <Form.Input
                  fluid
                  placeholder="Facebook Link"
                  name="facebookAccount"
                  onChange={onCorporateChange}
                />
              </Form.Field>
              <Form.Field
                error={corporateErrors.errorPaths.includes("instagramAccount")}
              >
                <label>Instagram Link</label>
                <Form.Input
                  fluid
                  placeholder="Instagram Link"
                  name="instagramAccount"
                  onChange={onCorporateChange}
                />
              </Form.Field>
              <Form.Field
                error={corporateErrors.errorPaths.includes("twitterAccount")}
              >
                <label>Twitter Link</label>
                <Form.Input
                  fluid
                  placeholder="Twitter Link"
                  name="twitterAccount"
                  onChange={onCorporateChange}
                />
              </Form.Field>
              <Form.Field
                error={corporateErrors.errorPaths.includes("linkedinAccount")}
              >
                <label>LinkedIn Link</label>
                <Form.Input
                  fluid
                  placeholder="LinkedIn Link"
                  name="linkedinAccount"
                  onChange={onCorporateChange}
                />
              </Form.Field>
            </Form.Group>

            <Button type="submit">Register Client</Button>
          </Form>
        </Grid.Column>
      ),
    },
    {
      menuItem: "Individual Client",
      render: () => (
        <Grid.Column>
          {successMsg ? (
            <Message
              positive
              onDismiss={handleDismiss}
              header="status"
              content={successMsg}
            />
          ) : (
            ""
          )}

          <Form
            onSubmit={onSubmit}
            noValidate
            className={loading ? "loading" : ""}
          >
            <Form.Group>
              <Message visible={!!errors.errors.length || visible} warning>
                <Message.Header>
                  Please correct the following issues:
                </Message.Header>
                {!!responseErrors.length && <Message>{responseErrors}</Message>}
                {<Message.List items={errors.errors} />}
              </Message>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                required
                error={errors.errorPaths.includes("firstName")}
              >
                <label>First Name</label>
                <Form.Input
                  fluid
                  placeholder="First Name"
                  name="firstName"
                  onChange={onChange}
                />
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes("lastName")}
              >
                <label>Middle Name</label>
                <Form.Input
                  fluid
                  placeholder="Middle Name"
                  name="lastName"
                  onChange={onChange}
                />
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes("surname")}
              >
                <label>Surname</label>
                <Form.Input
                  fluid
                  placeholder="Surname"
                  name="surname"
                  onChange={onChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Postal Address</label>
                <Form.Input
                  fluid
                  placeholder="Post Address"
                  name="postalAddress"
                  onChange={onChange}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field required error={errors.errorPaths.includes("kraPin")}>
                <label>KRA PIN Number</label>
                <Form.Input
                  fluid
                  placeholder="KRA PIN Number"
                  name="kraPin"
                  onChange={onChange}
                />
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes("firstName")}
              >
                <label>Occupation</label>
                <Form.Input
                  fluid
                  placeholder="Occupation"
                  name="occupation"
                  onChange={onChange}
                />
              </Form.Field>
              <Form.Field
                required={values.status === "P" ? false : true}
                error={errors.errorPaths.includes("phoneNumber")}
              >
                <PhoneInput
                  inputExtraProps={{
                    name: "phoneNumber",
                    required: true,
                    autoFocus: true,
                    enableSearch: true,
                  }}
                  style={{ fontWeight: "bold" }}
                  name="phoneNumber"
                  specialLabel="Phone Number *"
                  country={"ke"}
                  value={values.phoneNumber}
                  onChange={onPhoneNumberChange}
                />
              </Form.Field>
              <Form.Field required error={errors.errorPaths.includes("town")}>
                <label>Residence (Town)</label>
                <Form.Input
                  fluid
                  placeholder="Residence (Town)"
                  name="town"
                  onChange={onChange}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                required
                error={errors.errorPaths.includes("idNumber")}
              >
                <label>ID Number</label>
                <Form.Input
                  fluid
                  placeholder="ID Number"
                  name="idNumber"
                  type="number"
                  onChange={onChange}
                />
              </Form.Field>
              <Form.Field
                required={values.status === "P" ? false : true}
                error={errors.errorPaths.includes("email")}
              >
                <label>Email</label>
                <Form.Input
                  fluid
                  placeholder="Email Address"
                  name="email"
                  type="email"
                  onChange={onChange}
                />
              </Form.Field>
              <Form.Field required error={errors.errorPaths.includes("gender")}>
                <label>Gender</label>
                <Dropdown
                  placeholder="Select Gender"
                  fluid
                  selection
                  onChange={handleOnGenderChange}
                  options={genderOptions}
                />
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes("dateOfBirth")}
              >
                <label>Date Of Birth</label>

                <DateInput
                  name="dateOfBirth"
                  autoComplete="off"
                  placeholder="Date Of Birth"
                  popupPosition="bottom left"
                  value={values.dateOfBirth ? values.dateOfBirth : ""}
                  iconPosition="left"
                  dateFormat="YYYY-MM-DD"
                  maxDate={moment()}
                  onChange={onChange}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              {contactPersons.items && (
                <Form.Field>
                  <label>Contact Person(s)</label>
                  <Contacts
                    multiple={true}
                    clients={contactPersons.items}
                    handleOnClientSearch={handleOnContactSearch}
                    handleOnClientChange={handleOnContactChange}
                  />
                </Form.Field>
              )}
              <Form.Field required error={errors.errorPaths.includes("status")}>
                <label>Client Status</label>
                {statusOpts && statusOpts.statusOptions && (
                  <StatusTypes
                    statusTypes={statusOpts.statusOptions}
                    handleOnStatusTypesChange={handleOnStatusTypesChange}
                  />
                )}
              </Form.Field>
            </Form.Group>
            <Button type="submit">Register Client</Button>
          </Form>
        </Grid.Column>
      ),
    },
    {
      menuItem: "Clients Upload",
      render: () => <Uploadzone />,
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
                <a href="/staff/dashboard/client-records">Client Records</a>{" "}
                {">"} Register New Client
                <Header.Subheader>
                  Hello there {authContext.user.username}, Fill in this form to
                  register a new client
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>
      </Grid>
      <Tab
        className="clear-top"
        menu={{ secondary: true, pointing: true }}
        panes={panes}
      />
    </Container>
  );
}

export default AddNewClient;
