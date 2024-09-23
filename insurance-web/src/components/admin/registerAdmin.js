import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useContext, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { Link } from "react-router-dom";
import {
  Container,
  Divider,
  Form,
  Grid,
  Header,
  Message,
  MessageHeader,
  MessageItem,
  MessageList,
  Tab,
} from "semantic-ui-react";
import { AuthContext } from "../../context/auth";

import * as yup from "yup";
import "../root.scss";

let schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please provide an email"),
  firstName: yup.string().required("Please provide the first name"),
  lastName: yup.string().required("Please provide the middle name"),
  password: yup.string().required("Password is required"),
  phoneNumber: yup
    .string()
    .min(12, "Please enter a valid phone number")
    .max(13, "Please enter a valid phone number")
    .required("Please provide a phone number"),
  username: yup.string().required("Please provide a username"),
  name: yup.string().required("Agency name is required"),
  officeLocation: yup.string().required("Please provide the office location"),
  boxNumber: yup.number().typeError("Please provide a valid box number"),
  postalCode: yup
    .number()
    .required("Postal Code is required")
    .typeError("Please provide a valid postal code"),
  agencyPhoneNumber: yup
    .string()
    .min(12, "Please enter a valid phone number")
    .max(13, "Please enter a valid phone number")
    .required("Please provide agency phone number"),
  agencyEmail: yup
    .string()
    .email("Please enter a valid email")
    .required("Please provide agency email"),
  // privacyPolicy: yup
  //   .boolean()
  //   .oneOf([true], "This field must be checked")
  //   .required("This field must be checked"),
});

function RegisterAdmin(props) {
  const [errors, setErrors] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const context = useContext(AuthContext);

  const [values, setValues] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    name: "",
    officeLocation: "",
    boxNumber: "",
    agencyEmail: "",
    agencyPhoneNumber: "",
    postalCode: "",
  });
  const [privacyPolicy, setprivacyPolicy] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(null); // set at submission

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      context.registerAdmin(result.data);
      props.history.push({
        pathname: "/",
        state: { systemAlert: result.data.createAdmin.message },
      });
    },
    onError(err) {
      setVisible(true);
      try {
        if (err?.networkError) {
          const message = err.networkError.result.errors[0]?.message || "";
          setErrors((prev) => [...prev, message]);
        } else if (err?.graphQLErrors) {
          const messages = err.graphQLErrors?.map((err) => err?.message || "");
          setErrors((prev) => [...prev, ...messages]);
        }
      } catch (e) {
        console.log("uncaught", e);
      }
    },
    variables: values,
  });

  const validateField = async (field, value) => {
    await yup
      .reach(schema, field)
      .validate(value)
      .then(() => {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: null,
        }));
      })
      .catch((error) => {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: error?.message,
        }));
      });
  };

  const onChange = async (event, { name, value }) => {
    setErrors([]);
    try {
      setValues({ ...values, [name]: value });
      await validateField(name, value);
    } catch (err) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: err?.message,
      }));
    }
  };
  const onPhoneNumberChange = async (value) => {
    setErrors([]);
    setValues({ ...values, phoneNumber: "+" + value });
    await validateField("phoneNumber", value);
  };
  const onAgencyPhoneNumberChange = async (value) => {
    setErrors([]);
    setValues({ ...values, agencyPhoneNumber: "+" + value });
    await validateField("agencyPhoneNumber", value);
  };

  const [visible, setVisible] = useState(false);

  const handleDismiss = () => {
    setVisible(false);
    setErrors([]);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    let hasErrors = false;
    setHasAccepted(privacyPolicy);
    await schema
      .validate(values, { abortEarly: false })
      .then((valid) => {
        setValidationErrors({});
        hasErrors = false;
      }) //called if the entire form is valid
      .catch((err) => {
        hasErrors = true;
        const formErrors = err.inner.reduce(
          (errors, item) => ({ ...errors, [item.path]: item.message }),
          {}
        );
        setValidationErrors(formErrors);
      });
    setVisible(false);
    if (
      !Object.values(validationErrors)?.filter(Boolean)?.length &&
      !hasErrors &&
      hasAccepted
    ) {
      addUser();
    }
  };

  const panes = [
    {
      menuItem: "Admin Registration",
      render: () => (
        <Form
          onSubmit={onSubmit}
          noValidate
          className={loading ? "loading" : ""}
        >
          <Divider horizontal>Personal Information</Divider>

          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="Username"
              placeholder="Username"
              name="username"
              value={values.username}
              onChange={onChange}
              error={validationErrors?.username}
            />

            <Form.Input
              fluid
              label="First name"
              placeholder="First name"
              name="firstName"
              value={values.firstName}
              onChange={onChange}
              error={validationErrors?.firstName}
            />

            <Form.Input
              fluid
              label="Last name"
              placeholder="Last name"
              name="lastName"
              value={values.lastName}
              onChange={onChange}
              error={validationErrors?.lastName}
            />
          </Form.Group>

          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="Password"
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={onChange}
              type="password"
              error={validationErrors?.password}
            />

            <Form.Input
              fluid
              label="Email"
              placeholder="Email Address"
              name="email"
              value={values.email}
              onChange={onChange}
              error={validationErrors?.email}
            />
            <Form.Field error={validationErrors?.phoneNumber != null}>
              <PhoneInput
                inputExtraProps={{
                  name: "phoneNumber",
                  required: true,
                  autoFocus: true,
                  enableSearch: true,
                }}
                name="phoneNumber"
                specialLabel="Phone Number"
                country={"ke"}
                value={values.phoneNumber}
                onChange={onPhoneNumberChange}
              />
              {!!validationErrors?.phoneNumber && (
                <div
                  className="ui pointing above prompt label"
                  role="alert"
                  aria-atomic="true"
                >
                  {validationErrors?.phoneNumber}
                </div>
              )}
            </Form.Field>
          </Form.Group>

          <Divider horizontal>Agency Information</Divider>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="Agency Name"
              placeholder="Name of Agency"
              name="name"
              value={values.name}
              onChange={onChange}
              error={validationErrors?.name}
            />
            <Form.Input
              fluid
              label="Office Location"
              placeholder="Agency Location"
              name="officeLocation"
              value={values.officeLocation}
              onChange={onChange}
              error={validationErrors?.officeLocation}
            />
            <Form.Input
              fluid
              label="Box Number"
              placeholder="Box Number"
              name="boxNumber"
              value={values.boxNumber}
              onChange={onChange}
              type="number"
              error={validationErrors?.boxNumber}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="Postal Code"
              placeholder="Postal Code"
              name="postalCode"
              value={values.postalCode}
              onChange={onChange}
              error={validationErrors?.postalCode}
            />
            <Form.Input
              fluid
              label="Agency Email"
              placeholder="Agency Email Address"
              name="agencyEmail"
              value={values.agencyEmail}
              onChange={onChange}
              error={validationErrors?.agencyEmail}
            />
            <Form.Field error={validationErrors?.agencyPhoneNumber != null}>
              <PhoneInput
                inputExtraProps={{
                  name: "agencyPhoneNumber",
                  required: true,
                  autoFocus: true,
                  enableSearch: true,
                }}
                name="agencyPhoneNumber"
                specialLabel="Agency Phone Number"
                country={"ke"}
                value={values.agencyPhoneNumber}
                onChange={onAgencyPhoneNumberChange}
              />
              {!!validationErrors?.agencyPhoneNumber && (
                <div
                  className="ui pointing above prompt label"
                  role="alert"
                  aria-atomic="true"
                >
                  {validationErrors?.agencyPhoneNumber}
                </div>
              )}
            </Form.Field>
          </Form.Group>
          <Form.Checkbox
            name="privacyPolicy"
            label={
              <label>
                I accept Brooks' Terms and{" "}
                <Link
                  to="/privacy-policy"
                  target="__blank"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  {" "}
                  Privacy Policy
                </Link>
              </label>
            }
            onChange={(event) => {
              event.stopPropagation();
              setprivacyPolicy((prev) => !prev);
            }}
            error={
              hasAccepted != null &&
              privacyPolicy === false && {
                content: "This field must be checked",
                pointing: "left",
              }
            }
          />
          <Form.Button secondary>Register Admin</Form.Button>
        </Form>
      ),
    },
  ];

  return (
    <div className=".app-container">
      <Container>
        <Grid padded>
          <Grid.Row>
            <Grid.Column>
              <Header as="h1">Sign Up</Header>
              <div className="center">
                Already got an account?
                <Link to="/"> Sign In Here</Link>
              </div>

              <Tab
                className="clear-top"
                menu={{ secondary: true, pointing: true }}
                panes={panes}
              />

              {visible && !!errors?.length && (
                <Message error onDismiss={handleDismiss}>
                  <MessageHeader>System Response</MessageHeader>
                  <MessageList>
                    {errors.map((error, id) => (
                      <MessageItem key={id}>{error}</MessageItem>
                    ))}
                  </MessageList>
                </Message>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

const REGISTER_USER = gql`
  mutation createAdmin(
    $username: String!
    $firstName: String!
    $lastName: String!
    $password: String!
    $email: String!
    $phoneNumber: String!
    $name: String!
    $officeLocation: String!
    $boxNumber: Int
    $postalCode: Int!
    $agencyPhoneNumber: String!
    $agencyEmail: String!
  ) {
    createAdmin(
      admin: {
        username: $username
        password: $password
        email: $email
        firstName: $firstName
        lastName: $lastName
        phoneNumber: $phoneNumber
        image: "https://res.cloudinary.com/dsw3onksq/image/upload/v1592728825/user_x89zcm.png"
      }
      agency: {
        name: $name
        officeLocation: $officeLocation
        boxNumber: $boxNumber
        postalCode: $postalCode
        phoneNumber: $agencyPhoneNumber
        agencyEmail: $agencyEmail
        imageUrl: "https://res.cloudinary.com/dsw3onksq/image/upload/v1592728825/user_x89zcm.png"
      }
    ) {
      status
      message
      admin {
        id
        username
        email
        firstName
        isSuperuser
        isActive
        isStaff
        image
        phoneNumber
        roles
        agency {
          id
          name
          officeLocation
          imageUrl
          agencyEmail
          postalCode
          boxNumber
          isActive
        }
      }
    }
  }
`;
export default RegisterAdmin;
