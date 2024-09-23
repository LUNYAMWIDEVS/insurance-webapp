import React, { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../../context/auth";
import { GET_CORPORATE_CLIENT, UPDATE_CORPORATE_CLIENT } from "./queries";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Segment,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Grid,
  Label,
  Icon,
  Container,
  Header,
  List,
  ButtonGroup,
  Button,
  ButtonOr,
  Form,
  ListItem,
  Message,
  FormTextArea,
} from "semantic-ui-react";
import moment from "moment";
import PhoneInput from "react-phone-input-2";
import * as yup from "yup";
import { useHistory } from "react-router-dom";
import EditContactPerson from "./editContactPerson";

const validationSchema = yup.object().shape({
  name: yup.string().required("Company name is required"),
  kraPin: yup
    .string()
    .required("Please provide the KRA pin")
    .matches(/((\d+[A-Z])|([A-Z]+\d)[\dA-Z]*)/, {
      excludeEmptyString: true,
      message: "Enter a valid KRA pin",
    }),
  about: yup.string().required("Tell us about your company"),
  phoneNumber: yup
    .string()
    .required("Please provide a phone number")
    .min(12, "Please enter a valid phone number")
    .max(13, "Please enter a valid phone number"),
  status: yup.string().required("Status is required"),
  postalAddress: yup.string().required("Postal address is required"),
  town: yup.string().required("Town is required"),
});

const statusOptions = [
  { key: "a", text: "Active", value: "Active" },
  { key: "d", text: "Dormant", value: "Dormant" },
  { key: "p", text: "Prospective", value: "Prospective" },
];

export default function CorporateClientProfile({ props }) {
  const [editMode, setEditMode] = useState(false);
  const [values, setValues] = useState({
    id: null,
    name: "",
    kraPin: "",
    email: "",
    about: "",
    phoneNumber: "",
    status: "",
    town: "",
    postalAddress: "",
    contactPersons: [],
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [editContactPerson, setEditContactPerson] = useState(false);

  const userContext = useContext(AuthContext);
  const clientId = props.computedMatch.params.clientId;

  const { data: corporateData } = useQuery(GET_CORPORATE_CLIENT, {
    variables: { id: clientId },
  });

  const history = useHistory();

  const handleRedirect = () => {
    history.push("/staff/dashboard/add-new-contact-person");
  };

  useEffect(() => {
    if (corporateData) {
      setValues({
        id: corporateData.corporateClient.id,
        name: corporateData.corporateClient.name,
        kraPin: corporateData.corporateClient.kraPin,
        email: corporateData.corporateClient.email,
        about: corporateData.corporateClient.about,
        phoneNumber: corporateData.corporateClient.phoneNumber,
        status: corporateData.corporateClient.status,
        town: corporateData.corporateClient.town,
        postalAddress: corporateData.corporateClient.postalAddress,
        contactPersons: corporateData.corporateClient.contactPersons,
      });
    }
  }, [corporateData]);

  const handleEditMode = () => {
    setEditMode((state) => !state);
  };

  const validateField = async (field, value) => {
    await yup
      .reach(validationSchema, field)
      .validate(value)
      .then(
        setErrors((prev) => ({
          ...prev,
          [field]: null,
        }))
      )
      .catch((error) => {
        setErrors((prev) => ({
          ...prev,
          [field]: error?.message,
        }));
      });
  };

  const handleChange = async (e, { name, value }) => {
    setErrors({});

    try {
      setValues({ ...values, [name]: value });
      await validateField(name, value);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [name]: err?.message,
      }));
    }
  };

  const onPhoneNumberChange = useCallback(
    async (value) => {
      setErrors({});
      setValues({ ...values, phoneNumber: value });
      await validateField("phoneNumber", value);
    },
    [values]
  );

  const getChangedValues = () => {
    let updatedValues = {};
    Object.keys(values).forEach((key) => {
      if (values[key] !== corporateData?.corporateClient[key]) {
        updatedValues[key] = values[key];
      }
    });
    return updatedValues;
  };

  const [updateCorporateClient, { loading, data, error }] = useMutation(
    UPDATE_CORPORATE_CLIENT,
    {
      onCompleted: (data) => {
        handleEditMode();
        setErrorMessage(null);
      },
      onError: (error) => {
        // console.log("Endpoint error", error);
        setSuccessMessage(null);
      },
    }
  );

  useEffect(() => {
    if (data) {
      setSuccessMessage("Client updated successfully");
      setTimeout(() => setSuccessMessage(null), 5000);
    }
    if (error) {
      setErrorMessage(error?.message);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  }, [data, error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors();
    await validationSchema
      .validate(values, { abortEarly: false })
      .then((valid) => {
        setErrors({});
        if (Object.keys(getChangedValues()).length > 0) {
          const updatedUser = getChangedValues();
          if (updatedUser.status) {
            updatedUser.status = values.status[0];
          }
          updateCorporateClient({
            variables: {
              id: corporateData?.corporateClient?.id,
              input: updatedUser,
            },
          });
        }
      })
      .catch((err) => {
        // console.log("Err", err);
        const formErrors = err.inner.reduce(
          (errors, item) => ({ ...errors, [item.path]: item.message }),
          {}
        );
        setErrors(formErrors);
      });
  };

  return (
    <Container style={{ padding: "20px" }}>
      <Grid container>
        <Grid.Column>
          <div className="content-wrapper">
            <Header as="h2">
              <Icon name="file" />
              <Header.Content>
                <a href="/staff/dashboard/overview">Overview</a> {">"}{" "}
                <a href="/staff/dashboard/crm">CRM</a> {">"}{" "}
                <a href="/staff/dashboard/client-records">Client Records</a>{" "}
                {">"} Client Details
                <Header.Subheader>
                  Hey there {userContext.user.username}, Here is the Corporate
                  client details
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>
      </Grid>

      {values && (
        <Grid>
          <Grid.Column mobile={16} tablet={4} computer={3}>
            <List relaxed animated>
              <ListItem>
                <Label color="olive">
                  Client Number: {corporateData?.corporateClient?.clientNumber}
                </Label>
              </ListItem>

              <ListItem>
                <Label color="green">
                  Date Joined:{" "}
                  {moment(corporateData?.corporateClient?.createdAt).format(
                    "YYYY-MM-DD"
                  )}
                </Label>
              </ListItem>
            </List>
            <Button fluid active={editMode} onClick={handleEditMode}>
              Edit Information
            </Button>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={13}>
            <Form size="large" onSubmit={handleSubmit}>
              {successMessage && <Message positive content={successMessage} />}
              {errorMessage && <Message negative content={errorMessage} />}

              <Segment>
                <Header as="h5" dividing>
                  Company Information
                </Header>

                <Form.Input
                  label="Company Name"
                  type="text"
                  name="name"
                  onChange={handleChange}
                  readOnly={!editMode}
                  defaultValue={values.name}
                  error={errors?.name}
                  required
                />

                <Form.Group widths="equal">
                  <Form.Input
                    label="KRA PIN Number"
                    type="text"
                    name="kraPin"
                    defaultValue={values.kraPin}
                    onChange={handleChange}
                    readOnly={!editMode}
                    error={errors?.kraPin}
                    required
                  />

                  <Form.Input
                    label="Email"
                    type="email"
                    required
                    defaultValue={corporateData?.corporateClient?.email}
                    readOnly
                  />
                </Form.Group>

                <FormTextArea
                  label="About Company"
                  type="text"
                  name="about"
                  onChange={handleChange}
                  readOnly={!editMode}
                  defaultValue={values.about}
                  error={errors?.about}
                  required
                />
                <Form.Group widths="equal">
                  <Form.Field error={errors?.phoneNumber != null}>
                    <PhoneInput
                      inputProps={{
                        name: "phoneNumber",
                        required: true,
                        readOnly: !editMode,
                      }}
                      country={"ke"}
                      value={values.phoneNumber}
                      onChange={onPhoneNumberChange}
                      specialLabel="Phone Number *"
                      containerStyle={{ width: "100%" }}
                    />
                    {!!errors?.phoneNumber && (
                      <div
                        className="ui pointing above prompt label"
                        role="alert"
                        aria-atomic="true"
                      >
                        {errors?.phoneNumber}
                      </div>
                    )}
                  </Form.Field>
                  <Form.Select
                    fluid
                    label="Status"
                    name="status"
                    options={statusOptions}
                    value={values.status}
                    onChange={handleChange}
                    error={errors?.status}
                  />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Input
                    label="Postal Address"
                    type="text"
                    name="postalAddress"
                    defaultValue={values.postalAddress}
                    onChange={handleChange}
                    readOnly={!editMode}
                    error={errors?.postalAddress}
                  />
                  <Form.Input
                    label="Residence (Town)"
                    type="text"
                    name="town"
                    onChange={handleChange}
                    defaultValue={values.town}
                    error={errors?.town}
                  />
                </Form.Group>

                <Header as="h5" dividing>
                  Contact Persons
                </Header>
                {values.contactPersons.length === 0 ? (
                  <Grid verticalAlign="middle">
                    <Grid.Column mobile={16} tablet={12} computer={12}>
                      <Message info>Client has no contact person</Message>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={4} computer={4}>
                      <Button color="teal" onClick={handleRedirect}>
                        Create
                      </Button>
                    </Grid.Column>
                  </Grid>
                ) : (
                  <Table celled padded>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell>Full Name</TableHeaderCell>
                        <TableHeaderCell>Email</TableHeaderCell>
                        <TableHeaderCell>Phone Number</TableHeaderCell>
                        <TableHeaderCell>Position</TableHeaderCell>
                        <TableHeaderCell></TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {values.contactPersons &&
                        values.contactPersons.map((person) => (
                          <TableRow key={person.id}>
                            <TableCell>{person.name}</TableCell>
                            <TableCell>{person.email}</TableCell>
                            <TableCell>{person.phoneNumber}</TableCell>
                            <TableCell>{person.position}</TableCell>
                            <TableCell>
                              <EditContactPerson
                                open={editContactPerson}
                                onOpen={() => setEditContactPerson(true)}
                                onClose={() => setEditContactPerson(false)}
                                person={person}
                                clientId={values.id}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}

                {editMode && (
                  <Grid
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "end",
                    }}
                    padded
                  >
                    <ButtonGroup>
                      <Button basic negative onClick={handleEditMode}>
                        Cancel
                      </Button>
                      <ButtonOr />
                      <Button positive type="submit" disabled={loading}>
                        Save
                      </Button>
                    </ButtonGroup>
                  </Grid>
                )}
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      )}
    </Container>
  );
}
