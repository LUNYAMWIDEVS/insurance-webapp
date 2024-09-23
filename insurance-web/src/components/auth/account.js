import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Label,
  Button,
  Message,
  Loader,
  Dimmer,
  Segment,
  List,
  ListItem,
  LabelDetail,
  ButtonGroup,
  ButtonOr,
} from "semantic-ui-react";
import { AuthContext } from "../../context/auth";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { UPDATE_USER, USER_PROFILE_QUERY } from "./queries";
import moment from "moment";
import PhoneInput from "react-phone-input-2";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("Please provide the first name"),
  lastName: yup.string().required("Please provide the last name"),
  phoneNumber: yup
    .string()
    .required("Please provide a phone number")
    .min(12, "Please enter a valid phone number")
    .max(13, "Please enter a valid phone number"),
});

export default function Account() {
  const context = useContext(AuthContext);
  const userId = context.user.id;
  const {
    data: userData,
    error: isError,
    loading,
  } = useQuery(USER_PROFILE_QUERY, {
    variables: { id: userId },
  });
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    surname: "",
    createdAt: "",
    username: "",
    phoneNumber: "",
    email: "",
    status: null,
    image: "",
    roles: [],
  });

  useEffect(() => {
    if (userData) {
      const userInformation = {
        firstName: userData.user.firstName,
        lastName: userData.user.lastName,
        createdAt: userData.user.createdAt,
        username: userData.user.username,
        email: userData.user.email,
        phoneNumber: userData.user.phoneNumber,
        isActive: userData.user.isActive,
        image: userData.user.image,
        roles: userData.user.roles,
      };
      setUser(userInformation);
    }
  }, [userData]);

  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleEdit = () => {
    setEditMode((prev) => !prev);
  };
  const [updateuser, { data, error }] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: USER_PROFILE_QUERY, variables: { id: userId } }],
    onCompleted: () => {
      handleEdit();
      setErrorMessage(null);
    },
    onError: (error) => {
      setErrorMessage(error.message || "An error occurred.");
      setSuccessMessage(null);
    },
  });

  useEffect(() => {
    if (data) {
      setSuccessMessage("Changes saved successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    }

    if (error) {
      setErrorMessage(error?.message);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  }, [data, error]);

  const onPhoneNumberChange = async (value) => {
    setErrors({});
    setUser({ ...user, phoneNumber: "+" + value });
    await validateField("phoneNumber", value);
  };

  const validateField = async (field, value) => {
    await yup
      .reach(validationSchema, field)
      .validate(value)
      .then(() => {
        setErrors((prev) => ({
          ...prev,
          [field]: null,
        }));
      })
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

  const getChangedValues = () => {
    let updatedValues = {};
    Object.keys(user).forEach((key) => {
      if (user[key] !== userData?.user[key]) {
        updatedValues[key] = user[key];
      }
    });
    return updatedValues;
  };

  const handleSave = async (event) => {
    event.preventDefault();
    await validationSchema
      .validate(user, { abortEarly: false })
      .then(() => {
        setErrors({});
        if (Object.keys(getChangedValues()).length > 0) {
          const updatedUserDetails = getChangedValues();
          const userId = userData?.user?.id;
          updateuser({
            variables: {
              id: userId,
              input: updatedUserDetails,
            },
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
  if (loading) {
    return (
      <Container>
        <Dimmer active inverted>
          <Loader
            size="large"
            active
            indeterminate
            content="Loading profile..."
          />
        </Dimmer>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <Segment>
          <Grid container columns={1} padded>
            <Grid.Column>
              <div className="content-wrapper">
                <Header as="h2">
                  <Icon name="exclamation triangle" />
                  <Header.Content>
                    Failed to display profile
                    <Header.Subheader>{isError?.message}</Header.Subheader>
                  </Header.Content>
                </Header>
              </div>
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    );
  }
  return (
    <Container style={{ padding: "20px" }}>
      <Grid container>
        <Grid.Column>
          <div className="content-wrapper">
            <Header as="h2">
              <Icon name="user" size="mini" />
              <Header.Content>Account settings</Header.Content>
              <Header.Subheader>
                Hey there {context.user.username} manage user details and
                preferences
              </Header.Subheader>
            </Header>
          </div>
        </Grid.Column>
      </Grid>
      <>
        {/* {loading && } */}
        {user && (
          <Grid>
            <Grid.Column mobile={16} tablet={4} computer={4}>
              <Image
                src={user.image}
                size="small"
                alt="Profile Picture"
                circular
                bordered
                centered
              />

              <List divided relaxed>
                <ListItem></ListItem>
                <ListItem>
                  {user.isActive ? (
                    <Label color="green">
                      Status: <LabelDetail>Active</LabelDetail>
                    </Label>
                  ) : (
                    <Label color="orange">
                      Status: <LabelDetail>Inactive</LabelDetail>
                    </Label>
                  )}
                </ListItem>
                <ListItem>
                  <Label color="olive">
                    Date Joined:{" "}
                    <LabelDetail>
                      {moment(user.createdAt).format("YYYY-MM-DD")}
                    </LabelDetail>
                  </Label>
                </ListItem>
                <ListItem>
                  <h5>
                    {user.roles.length > 1 ? "User roles:" : "User role:"}{" "}
                    <span style={{ marginLeft: "1rem" }}>
                      {user.roles.map((role, index) => (
                        <Label key={index} active color="teal">
                          {role}
                        </Label>
                      ))}
                    </span>
                  </h5>
                </ListItem>
                <ListItem></ListItem>
              </List>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={10} computer={10}>
              <Form onSubmit={handleSave}>
                {successMessage && <Message positive>{successMessage}</Message>}
                {errorMessage && <Message negative>{errorMessage}</Message>}
                <Form.Group widths="equal">
                  <Form.Input
                    label="First Name"
                    required
                    type="text"
                    name="firstName"
                    defaultValue={user.firstName}
                    readOnly={!editMode}
                    onChange={handleChange}
                    error={errors?.firstName}
                    fluid
                  />
                  <Form.Input
                    fluid
                    label="Last Name"
                    required
                    type="text"
                    name="lastName"
                    defaultValue={user.lastName}
                    readOnly={!editMode}
                    onChange={handleChange}
                    error={errors?.lastName}
                  />
                </Form.Group>

                <Form.Input
                  label="Email"
                  type="email"
                  name="email"
                  fluid
                  defaultValue={user.email}
                  readOnly
                  // error={errors?.email}
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
                  <Form.Input
                    fluid
                    label="Username"
                    required
                    type="text"
                    name="username"
                    defaultValue={user.username}
                    readOnly
                  />
                </Form.Group>

                {!editMode && <Button onClick={handleEdit}>Edit</Button>}
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
                      <Button basic negative onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                      <ButtonOr />
                      <Button positive type="submit">
                        Save
                      </Button>
                    </ButtonGroup>
                  </Grid>
                )}
              </Form>
            </Grid.Column>
          </Grid>
        )}
      </>
    </Container>
  );
}
