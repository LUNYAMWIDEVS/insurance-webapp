import { useMutation } from "@apollo/react-hooks";
import React, { useCallback, useState } from "react";
import PhoneInput from "react-phone-input-2";
import {
  Button,
  Form,
  Grid,
  Label,
  MessageHeader,
  MessageItem,
  MessageList,
  Segment,
  Message,
} from "semantic-ui-react";
import * as yup from "yup";
import { AGENCY_QUERY, UPDATE_AGENCY } from "../queries";

export default function AgencyForm({ details, handleClose }) {
  const [values, setValues] = useState({
    name: details.name,
    agencyEmail: details.agencyEmail,
    phoneNumber: details.phoneNumber,
    officeLocation: details.officeLocation,
    boxNumber: details.boxNumber,
    postalCode: details.postalCode,
  });
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});
  const schema = yup.object().shape({
    agencyEmail: yup
      .string()
      .email("Please enter a valid email")
      .required("Please provide an email"),
    name: yup.string().required("Please provide the agency name"),
    phoneNumber: yup
      .string()
      .min(12, "Please enter a valid phone number")
      .max(13, "Please enter a valid phone number")
      .required("Please provide a phone number"),
    officeLocation: yup.string().required("Please provide the agency location"),
    boxNumber: yup.number().required("Please provide a valid box number"),
    postalCode: yup.number().required("Please provide the postal code"),
  });

  const getChangedValues = () => {
    let newValues = {};
    Object.keys(values).forEach((key) => {
      if (values[key] !== details[key]) {
        newValues[key] = values[key];
      }
    });
    return newValues;
  };
  const [updateAgencyDetails, { loading, ...others }] = useMutation(
    UPDATE_AGENCY,
    {
      refetchQueries: [{ query: AGENCY_QUERY }],
      update(_, result) {
        setIsSuccess(true);
        setVisible(true);
        setTimeout(() => handleClose(), 1000);
      },
      onError(err) {
        setVisible(true);
        try {
          if (err?.networkError) {
            const message = err.networkError.result.errors[0]?.message || "";
            setErrors((prev) => [...prev, message]);
          } else if (err?.graphQLErrors) {
            const messages = err.graphQLErrors?.map(
              (err) => err?.message || ""
            );
            setErrors((prev) => [...prev, ...messages]);
          }
        } catch (e) {
          console.log("uncaught", e);
        }
      },
      variables: { input: getChangedValues(), id: details.id },
    }
  );

  const handleDismiss = () => {
    setVisible(false);
  };

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

  const onChange = async (event) => {
    setErrors([]);

    try {
      setValues({ ...values, [event.target.name]: event.target.value });
      await validateField(event.target.name, event.target.value);
    } catch (err) {
      setValidationErrors((prev) => ({
        ...prev,
        [event.target.name]: err?.message,
      }));
    }
  };

  const onPhoneNumberChange = useCallback(
    async (value) => {
      setErrors([]);
      setValues({ ...values, phoneNumber: "+" + value });
      await validateField("phoneNumber", value);
    },
    [values]
  );

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);

    await schema
      .validate(values, { abortEarly: false })
      .then((valid) => {
        setValidationErrors({});
        if (Object.keys(getChangedValues()).length > 0) updateAgencyDetails();
      })
      .catch((err) => {
        const formErrors = err.inner.reduce(
          (errors, item) => ({ ...errors, [item.path]: item.message }),
          {}
        );
        setValidationErrors(formErrors);
      });
  };
  return (
    <Form onSubmit={onSubmit} noValidate>
      <Grid container stackable>
        <Grid.Row columns={2}>
          <Grid.Column>
            <h3>Update {details?.name}</h3>
          </Grid.Column>
          <Grid.Column floated="right" width={2}>
            <div className="centered-content">
              <Button onClick={handleClose}>Back</Button>
              <Button primary disabled={loading}>
                Save
              </Button>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            {visible && errors?.length > 0 && (
              <Message onDismiss={handleDismiss}>
                <MessageHeader>System Response</MessageHeader>
                <MessageList>
                  {errors.map((error, index) => (
                    <MessageItem key={index}>{error}</MessageItem>
                  ))}
                </MessageList>
              </Message>
            )}

            {visible && isSuccess && (
              <Message>
                <MessageHeader>System Response</MessageHeader>
                <MessageList>
                  <MessageItem>Agency Updated Successfully.</MessageItem>
                </MessageList>
              </Message>
            )}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Form.Input
              focus
              fluid
              label="Agency Name"
              placeholder="Agency Name"
              name="name"
              value={values.name}
              onChange={onChange}
              id="name"
              error={validationErrors?.name}
            />
          </Grid.Column>
          <Grid.Column>
            <Form.Input
              fluid
              label="Agency Email"
              placeholder="Email"
              name="agencyEmail"
              value={values.agencyEmail}
              onChange={onChange}
              id="agencyEmail"
              error={validationErrors?.agencyEmail}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Form.Field error={validationErrors?.phoneNumber != null}>
              <PhoneInput
                inputExtraProps={{
                  name: "phoneNumber",
                  required: true,
                  autoFocus: true,
                  enableSearch: true,
                }}
                style={{ fontWeight: "bold" }}
                name="phoneNumber"
                specialLabel="Agency Phone Number *"
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
          </Grid.Column>
          <Grid.Column>
            <Form.Input
              fluid
              label="Office Location"
              placeholder="Office Location"
              name="officeLocation"
              value={values.officeLocation}
              onChange={onChange}
              id="officeLocation"
              error={validationErrors?.officeLocation}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Form.Input
              fluid
              label="P.O Box"
              placeholder="P.O Box"
              name="boxNumber"
              value={values.boxNumber}
              onChange={onChange}
              id="boxNumber"
              error={validationErrors?.boxNumber}
            />
          </Grid.Column>
          <Grid.Column>
            <Form.Input
              fluid
              label="Postal Code"
              placeholder="Postal Code"
              name="postalCode"
              value={values.postalCode}
              onChange={onChange}
              id="postalCode"
              error={validationErrors?.postalCode}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  );
}
