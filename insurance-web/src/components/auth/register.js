import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Grid, Container, Header, Tab, Form, Message } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import "../root.scss";

function Register(props) {
  const [errors, setErrors] = useState({});

  const [values, setValues] = useState({
    adminUsername: "",
    adminPassword: "",
    adminEmail: "",
    adminFirstName: "",
    adminLastName: "",
    adminPhoneNumber: "",
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      console.log(result);
      props.history.push("/");
    },
    onError(err) {
      try {
        // setErrors(err.networkError.result.errors[0]);
        if (err.networkError !== null && err.networkError !== "undefined") {
          setErrors(err.networkError.result.errors[0]);
        } else if (
          err.graphQLErrors !== null &&
          err.networkError !== "undefined"
        ) {
          setErrors(err.graphQLErrors.result.errors[0]);
        }
      } catch (e) {
        setErrors(err);
      }
    },
    variables: values,
  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const [visible, setVisible] = useState(false);

  const handleDismiss = () => {
    setVisible(false);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    errors.message = "";
    setVisible(true);
    addUser();
  };

  const panes = [
    {
      menuItem: "Admin Registration",
      render: () => (
        <Form className="clear-top" noValidate>
          <p as="h4" className="float-left">
            Personal Information
          </p>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="Name"
              placeholder="Username"
              name="adminUsername"
              value={values.adminUsername}
              onChange={onChange}
            />

            <Form.Input
              fluid
              label="First name"
              placeholder="First name"
              name="adminFirstName"
              value={values.adminFirstName}
              onChange={onChange}
            />

            <Form.Input
              fluid
              label="Last name"
              placeholder="Last name"
              name="adminLastName"
              value={values.adminLastName}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="Password"
              placeholder="Password"
              name="adminPassword"
              value={values.adminPassword}
              onChange={onChange}
              type="password"
            />

            <Form.Input
              fluid
              label="Email"
              placeholder="Email Address"
              name="adminEmail"
              value={values.adminEmail}
              onChange={onChange}
            />

            <Form.Input
              fluid
              label="Phone Number"
              placeholder="Phone number"
              name="adminPhoneNumber"
              value={values.adminPhoneNumber}
              onChange={onChange}
            />
          </Form.Group>

          <p as="h4" className="float-left">
            Agency Information
          </p>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="Agency Name"
              placeholder="Name of Agency"
            />
            <Form.Input
              fluid
              label="Office Location"
              placeholder="Agency Location"
            />
            <Form.Input fluid label="Box Number" placeholder="Box Number" />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input fluid label="Postal Code" placeholder="Postal Code" />
            <Form.Input
              fluid
              label="Agency Email"
              placeholder="Agency Email Address"
            />
            <Form.Input
              fluid
              label="Agency Phone Number"
              placeholder="Agency Phone number"
            />
          </Form.Group>

          <Form.Checkbox label="I agree to the Terms and Conditions" />
          <Form.Button secondary>Register Admin</Form.Button>
        </Form>
      ),
    },
    {
      menuItem: "Staff Registration",
      render: () => (
        <Form
          onSubmit={onSubmit}
          noValidate
          className={loading ? "loading" : ""}
        >
          <p as="h4" className="float-left">
            Personal Information
          </p>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="Username"
              placeholder="Username"
              name="username"
              value={values.username}
              onChange={onChange}
              id="username"
              errors={errors.username ? true : undefined}
            />

            <Form.Input
              fluid
              label="First name"
              placeholder="First name"
              name="firstName"
              value={values.firstName}
              onChange={onChange}
              errors={errors.firstName ? true : undefined}
            />

            <Form.Input
              fluid
              label="Last name"
              placeholder="Last name"
              name="lastName"
              value={values.lastName}
              onChange={onChange}
              errors={errors.lastName ? true : undefined}
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
              errors={errors.password ? true : undefined}
              type="password"
            />

            <Form.Input
              fluid
              label="Email"
              placeholder="Email Address"
              name="email"
              value={values.email}
              onChange={onChange}
              errors={errors.email ? true : undefined}
            />

            <Form.Input
              fluid
              label="Phone Number"
              placeholder="Phone number"
              name="phoneNumber"
              value={values.phoneNumber}
              onChange={onChange}
              errors={errors.phoneNumber ? true : undefined}
            />
          </Form.Group>

          <Form.Checkbox label="I agree to the Terms and Conditions" />
          <Form.Button secondary>Register Staff</Form.Button>
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
              {console.log(JSON.stringify(errors, null, 2))}

              {visible ? (
                <Message
                  onDismiss={handleDismiss}
                  header="System Response"
                  content={errors ? errors.message : ""}
                />
              ) : (
                ""
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

// const REGISTER_USER = gql`
//     mutation register(
//         $username: String!
//         $email: String!
//         $password: String!
//         $firstName: String!
//         $lastName: String!
//         $phoneNumber: String!
//         $image: String
//     ) {
//         register(
//             registerInput: {
//                 username: $username
//                 email: $email
//                 password: $password
//                 firstName: $firstName
//                 lastName: $lastName
//                 phoneNumber: $phoneNumber
//                 image: $image
//             }
//         ){
//             status
//             message
//             admin {
//               id
//               username
//               email
//               firstName
//               isSuperuser
//               isActive
//               isStaff
//               image
//               phoneNumber
//               roles
//               agency {
//                 id
//                 name
//                 officeLocation
//                 imageUrl
//                 agencyEmail
//                 postalCode
//                 boxNumber
//                 isActive
//               }
//             }
//         }

//     }

// `;

const REGISTER_USER = gql`
  mutation createUser {
    createUser(
      input: {
        username: "Humphrys M"
        password: "String@123"
        email: "humphreymusonye@gmail.com"
        firstName: "Humphrey"
        lastName: "Musonye"
        phoneNumber: "+254727737445"
        image: "https://res.cloudinary.com/dsw3onksq/image/upload/v1592728825/user_x89zcm.png"
      }
    ) {
      status
      user {
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
          agencyEmail
        }
      }
    }
  }
`;

export default Register;
