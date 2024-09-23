import React, { useState, useCallback, useEffect, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { Grid, Container, Header, Message } from "semantic-ui-react";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { AuthContext } from "../../context/auth";

import { useMutation } from "@apollo/react-hooks";
import { RESET_PASSWORD } from "./queries";
import * as yup from "yup";

import "../root.scss";

function ResetPassword(props) {
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState({
    message: "",
    tokenRetrieved: false,
  });
  const [errors, setErrors] = useState({
    errorPaths: [],
    errors: [],
  });
  const context = useContext(AuthContext);
  const token = props.match.params.token;
  useEffect(() => {
    if (!message.tokenRetrieved) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          setMessage({
            ...message,
            message: "Password reset link expired. Please request another one",
            tokenRetrieved: true,
          });
        } else {
          setMessage({ ...message, tokenRetrieved: true });
          context.setToken();
          localStorage.setItem("jwtToken", token);
        }
      } catch (error) {
        setMessage({
          ...message,
          message: "Invalid password reset link. Please request another one",
          tokenRetrieved: true,
        });
      }
    }
  }, [context, message, token]);

  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
    updated: false,
  });

  const handleDismiss = () => {
    setVisible(false);
  };
  let schema = yup.object().shape({
    password: yup
      .string()
      .required("No password provided.")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(/^(?=.*[0-9])/, "Password must contain a number")
      .matches(/^(?=.*[!@#$%^&*])/, "Password must contain a special character")
      .matches(/^(?=.*[A-Z])/, "Password must contain an uppercase letter")
      .matches(/^(?=.*[a-z])/, "Password must contain a lowercase letter"),
  });
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD, {
    update(_, result) {
      window.location.href = "/";
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
          setErrors({ ...errors, message: err.graphQLErrors[0].message });
        }

        if (err.networkError !== null && err.networkError !== "undefined") {
          setErrors({ ...errors, message: err.networkError.result.errors[0] });
        } else if (
          err.graphQLErrors !== null &&
          err.networkError !== "undefined"
        ) {
          setErrors({ ...errors, message: err.graphQLErrors.result.errors[0] });
        }
      } catch (e) {}
    },
    variables: values,
  });

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

  const onChange = useCallback(
    (event) => {
      setValues({
        ...values,
        [event.target.name]: event.target.value,
        updated: true,
      });
      setVisible(true);
    },
    [values]
  );
  useEffect(() => {
    if (values.updated) {
      validate(values);
      setValues({ ...values, updated: false });
    }
  }, [values, validate]);

  const onSubmit = (event) => {
    event.preventDefault();
    resetPassword();
  };

  return (
    <div className=".app-container">
      <Container>
        <Grid padded>
          <Grid.Row>
            {message.message ? (
              <Grid.Column>
                <Header as="h1">Reset Password</Header>
                <Message warning>
                  <Message.Header>Failed!</Message.Header>
                  <p>
                    {message.message}{" "}
                    <Link to="/password-reset-request"> Here</Link>
                  </p>
                </Message>
              </Grid.Column>
            ) : (
              <Grid.Column>
                <Header as="h1">Reset Password</Header>
                {visible && values.password && errors.errors.length ? (
                  <Message
                    onDismiss={handleDismiss}
                    header="System Response"
                    error
                    list={errors.errors}
                  />
                ) : (
                  ""
                )}

                {visible &&
                  values.confirmPassword &&
                  values.password &&
                  values.confirmPassword !== values.password && (
                    <Message onDismiss={handleDismiss} error>
                      Password and confirm password do not match
                    </Message>
                  )}

                <Form
                  onSubmit={onSubmit}
                  noValidate
                  className={loading ? "loading" : ""}
                >
                  <Form.Field
                    required
                    error={errors.errorPaths.includes("password")}
                  >
                    <label>Password</label>
                    <input
                      placeholder="Enter password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={onChange}
                    />
                  </Form.Field>
                  <Form.Field
                    required
                    error={
                      !!(
                        values.password &&
                        values.confirmPassword !== values.password
                      )
                    }
                  >
                    <label>Confirm Password</label>
                    <input
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={values.confirmPassword}
                      onChange={onChange}
                    />
                  </Form.Field>

                  <div className="center">
                    Already have an account?
                    <Link to="/"> Login</Link>
                  </div>
                  <Button type="submit" secondary>
                    Reset Password
                  </Button>
                </Form>
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

export default ResetPassword;
