import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { Grid, Container, Header, Message } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { useMutation } from "@apollo/react-hooks";
import { AuthContext } from "../../context/auth";
import { LOGIN_USER } from "./queries";
import "../root.scss";

function Login(props) {
  const [errors, setErrors] = useState({});
  const context = useContext(AuthContext);
  const [visible, setVisible] = useState(false);

  let alert;

  if (props.location.state) {
    alert = props.location.state.systemAlert;
  }

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const handleDismiss = () => {
    setVisible(false);
  };

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      context.login(result.data);
      window.location.href = "/admin/dashboard";
    },
    onError(err) {
      try {
        if (err.graphQLErrors) {
          setErrors({ message: err.graphQLErrors[0].message });
        }

        if (err.networkError !== null && err.networkError !== "undefined") {
          setErrors({ message: err.networkError.result.errors[0] });
        } else if (
          err.graphQLErrors !== null &&
          err.networkError !== "undefined"
        ) {
          setErrors({ message: err.graphQLErrors.result.errors[0] });
        }
      } catch (e) {}
    },
    variables: values,
  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setErrors({});
    loginUser();
    setVisible(true);
  };

  return (
    <div className=".app-container">
      <Container>
        <Grid padded>
          <Grid.Row>
            <Grid.Column>
              <Header as="h1">Sign In</Header>
              {alert && visible ? (
                <Message
                  onDismiss={handleDismiss}
                  header="System Response"
                  content={alert}
                />
              ) : (
                ""
              )}

              <div className="center">
                New to Brooks Agency?
                <Link to="/admin/register"> Sign Up Here</Link>
              </div>
              <Form
                onSubmit={onSubmit}
                noValidate
                className={loading ? "loading" : ""}
              >
                <Form.Field>
                  <label>Username</label>
                  <input
                    placeholder="Username"
                    name="username"
                    value={values.username}
                    onChange={onChange}
                  />
                </Form.Field>

                <Form.Field>
                  <label>Password</label>
                  <input
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={onChange}
                  />
                </Form.Field>
                <div className="center">
                  Forgot password?
                  <Link to="/password-reset-request"> Reset Password</Link>
                </div>
                <Button type="submit" secondary>
                  Sign In
                </Button>
              </Form>

              {visible && Object.keys(errors).length ? (
                <Message
                  onDismiss={handleDismiss}
                  header="Failed!"
                  warning
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

export default Login;
