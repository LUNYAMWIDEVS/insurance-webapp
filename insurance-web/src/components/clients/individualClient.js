import React, { useCallback, useEffect, useState, useContext } from "react";
import {
  Container,
  Grid,
  Header,
  Icon,
  Form,
  Segment,
  Button,
  ButtonGroup,
  ButtonOr,
  Label,
  List,
  ListItem,
  Message,
} from "semantic-ui-react";
import { DateInput } from "semantic-ui-calendar-react";
import moment from "moment";
import * as yup from "yup";
import PhoneInput from "react-phone-input-2";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_INDIVIDUAL_CLIENT } from "./queries";
import { AuthContext } from "../../context/auth";

const options = [
  { key: "m", text: "Male", value: "Male" },
  { key: "f", text: "Female", value: "Female" },
  { key: "o", text: "Other", value: "Other" },
];

const statusOptions = [
  { key: "a", text: "Active", value: "Active" },
  { key: "d", text: "Dormant", value: "Dormant" },
  { key: "p", text: "Prospective", value: "Prospective" },
];

const validationSchema = yup.object().shape({
  firstName: yup.string().required("Please provide the first name"),
  lastName: yup.string().required("Please provide the last name"),
  surname: yup.string().required("Please provide the  surname"),
  phoneNumber: yup
    .string()
    .required("Please provide a phone number")
    .min(12, "Please enter a valid phone number")
    .max(13, "Please enter a valid phone number"),
  town: yup.string().required("Please provide the town of residence"),
  idNumber: yup.number().required("Please provide the ID number"),
  kraPin: yup
    .string()
    .required("Please provide the KRA pin")
    .matches(/((\d+[A-Z])|([A-Z]+\d)[\dA-Z]*)/, {
      excludeEmptyString: true,
      message: "Enter a valid KRA pin",
    }),
  occupation: yup.string().nullable(),
  gender: yup.string().nullable(),
  status: yup.string().nullable(),
  postalAddress: yup.string().nullable(),
  dateOfBirth: yup.string().required("Date of birth is required"),
  // location: yup.string().nullable(),
});

const Inputfield = (props) => {
  const {
    name,
    label,
    type = "text",
    defaultValue,
    onChange,
    required,
    readOnly,
    errorMessage,
  } = props;

  return (
    <Form.Input
      name={name}
      type={type}
      label={label}
      defaultValue={defaultValue || ""}
      onChange={onChange}
      required={required}
      error={errorMessage ? errorMessage : null}
      readOnly={readOnly}
    />
  );
};

export default function IndividualClient({ user: initialUser }) {
  const userContext = useContext(AuthContext);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    surname: "",
    idNumber: "",
    kraPin: "",
    dateOfBirth: "",
    occupation: "",
    gender: "",
    phoneNumber: "",
    postalAddress: "",
    // location: "",
    town: "", //residence
    status: "",
    contactPersons: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (initialUser) {
      const userData = {
        firstName: initialUser.firstName,
        lastName: initialUser.lastName,
        surname: initialUser.surname,
        idNumber: initialUser.idNumber,
        kraPin: initialUser.kraPin,
        dateOfBirth: initialUser.dateOfBirth,
        occupation: initialUser.occupation,
        gender: initialUser.gender,
        phoneNumber: initialUser.phoneNumber,
        status: initialUser.status,
        postalAddress: initialUser.postalAddress || null,
        // location: initialUser.location || null,
        town: initialUser.town,
        contactPersons: initialUser.contactPersons || [],
      };
      setUser(userData);
    }
  }, [initialUser]);

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
      setUser({ ...user, [name]: value });
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
      setUser({ ...user, phoneNumber: value });
    },
    [user]
  );

  const getChangedValues = () => {
    let updatedValues = {};
    Object.keys(user).forEach((key) => {
      if (user[key] !== initialUser[key]) {
        updatedValues[key] = user[key];
      }
    });
    return updatedValues;
  };

  const [updateIndividualClient, { loading, data, error }] = useMutation(
    UPDATE_INDIVIDUAL_CLIENT,
    {
      onCompleted: (data) => {
        // console.log("Endpoint", data);
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
      .validate(user, { abortEarly: false })
      .then((valid) => {
        setErrors({});
        if (Object.keys(getChangedValues()).length > 0) {
          const updatedUser = getChangedValues();
          if (updatedUser.status) {
            updatedUser.status = user.status[0];
          }
          if (updatedUser.gender) {
            updatedUser.gender = user.gender[0];
          }
          updateIndividualClient({
            variables: { id: initialUser?.id, input: updatedUser },
          });
        }
      })
      .catch((err) => {
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

      {user && (
        <Grid>
          <Grid.Column mobile={16} tablet={4} computer={3}>
            <List relaxed animated>
              <ListItem>
                <Label color="olive">
                  Client Number: {initialUser?.clientNumber}
                </Label>
              </ListItem>

              <ListItem>
                <Label color="green">
                  Date Joined:{" "}
                  {moment(initialUser?.createdAt).format("YYYY-MM-DD")}
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
                  Basic Information
                </Header>
                <Form.Group widths="equal">
                  <Inputfield
                    label="First Name"
                    type="text"
                    name="firstName"
                    onChange={handleChange}
                    readOnly={!editMode}
                    defaultValue={user.firstName}
                    errorMessage={errors?.firstName}
                    required
                  />
                  <Inputfield
                    label="Last Name"
                    type="text"
                    name="lastName"
                    onChange={handleChange}
                    readOnly={!editMode}
                    defaultValue={user.lastName}
                    errorMessage={errors?.lastName}
                    required
                  />

                  <Inputfield
                    label="Surname"
                    type="text"
                    name="surname"
                    onChange={handleChange}
                    readOnly={!editMode}
                    defaultValue={user.surname}
                    errorMessage={errors?.surname}
                    required
                  />
                </Form.Group>
                <Form.Group widths="equal">
                  <Inputfield
                    label="National ID Number"
                    type="text"
                    name="idNumber"
                    defaultValue={user.idNumber}
                    onChange={handleChange}
                    readOnly={!editMode}
                    errorMessage={errors?.idNumber}
                    required
                  />
                  <Inputfield
                    label="KRA PIN Number"
                    type="text"
                    name="kraPin"
                    defaultValue={user.kraPin}
                    onChange={handleChange}
                    readOnly={!editMode}
                    errorMessage={errors?.kraPin}
                    required
                  />

                  <Form.Field
                    required
                    error={errors?.dateOfBirth ? true : false}
                  >
                    <label>Date Of Birth</label>

                    <DateInput
                      name="dateOfBirth"
                      autoComplete="off"
                      placeholder="Date Of Birth"
                      popupPosition="bottom left"
                      value={user.dateOfBirth ? user.dateOfBirth : ""}
                      iconPosition="left"
                      dateFormat="YYYY-MM-DD"
                      maxDate={moment()}
                      onChange={handleChange}
                      closable
                    />
                    {errors?.dateOfBirth && (
                      <Label basic color="red" pointing="below">
                        {errors?.dateOfBirth}
                      </Label>
                    )}
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Input
                    label="Occupation"
                    type="text"
                    name="occupation"
                    defaultValue={user.occupation}
                    onChange={handleChange}
                    readOnly={!editMode}
                    error={errors?.occupation}
                    fluid
                  />

                  <Form.Select
                    fluid
                    label="Status"
                    name="status"
                    options={statusOptions}
                    value={user.status}
                    onChange={handleChange}
                    error={errors?.status}
                  />

                  <Form.Select
                    fluid
                    label="Gender"
                    name="gender"
                    options={options}
                    value={user.gender}
                    onChange={handleChange}
                    error={errors?.gender}
                  />
                </Form.Group>
                <Header as="h5" dividing>
                  Contact Information
                </Header>
                <Form.Group widths="equal">
                  <Form.Input
                    label="Email"
                    type="email"
                    // name="email"
                    required
                    defaultValue={initialUser?.email}
                    readOnly
                  />

                  <Form.Input
                    label="Agency"
                    type="text"
                    defaultValue={initialUser?.agency?.name}
                    readOnly
                    required
                  />
                </Form.Group>
                {editMode && (
                  <Message
                    color="yellow"
                    header="Email and agency values above are not editable"
                  />
                )}
                <Form.Group widths="equal">
                  <Form.Field error={errors?.phoneNumber != null}>
                    <PhoneInput
                      inputProps={{
                        name: "phoneNumber",
                        required: true,
                        readOnly: !editMode,
                      }}
                      country={"ke"}
                      value={user.phoneNumber}
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

                  <Inputfield
                    label="Residence (Town)"
                    type="text"
                    name="town"
                    onChange={handleChange}
                    defaultValue={user.town}
                    errorMessage={errors?.town}
                  />
                </Form.Group>
                <Form.Group widths="equal">
                  <Inputfield
                    label="Postal Address"
                    type="text"
                    name="postalAddress"
                    defaultValue={user.postalAddress}
                    onChange={handleChange}
                    readOnly={!editMode}
                    errorMessage={errors?.postalAddress}
                  />
                  {/* <Inputfield
                    label="Location"
                    type="text"
                    name="location"
                    onChange={handleChange}
                    defaultValue={user.location}
                    errorMessage={errors?.location}
                  /> */}
                </Form.Group>
                {/* <Header as="h5" dividing>
                  Contact Persons
                </Header>
                <Table celled>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Name</TableHeaderCell>
                      <TableHeaderCell>Email</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.contactPersons.length === 0 ? (
                      <TableRow>
                        <TableCell>
                          This client has not contact person Information
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {user.contactPersons &&
                          user.contactPersons.map((person) => (
                            <TableRow key={person.id}>
                              <TableCell>{person.name}</TableCell>
                              <TableCell>{person.email}</TableCell>
                            </TableRow>
                          ))}
                      </>
                    )}
                  </TableBody>
                </Table> */}
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
