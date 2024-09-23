import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Icon,
  Loader,
  Message,
  MessageHeader,
  MessageItem,
  MessageList,
} from "semantic-ui-react";
import * as Yup from "yup";
import Contacts from "../clients/listContactPersons";
import { GET_CONTACT_PERSONS } from "../contactPersons/queries";
import { ADD_INSURANCE_COMPANY } from "./queries";
import { useHistory } from "react-router-dom";

const imageUrl =
  "https://res.cloudinary.com/dsw3onksq/image/upload/v1595314246/insurance-co_qr2qog.png";

const companySchema = Yup.object().shape({
  name: Yup.string().required("Company name is required"),
  contactPerson: Yup.string().required("Contact person is required"),
  email: Yup.string()
    .email("Email must be valid")
    .required("Company email is required"),
  postalAddress: Yup.string().required("This field is required"),
  physicalAddress: Yup.string().required("This field is required"),
  mobileNumber: Yup.string()
    .min(12, "Please enter a valid phone number")
    .max(13, "Please enter a valid phone number")
    .required("Please provide a phone number"),
  telephoneNumber: Yup.string()
    .min(12, "Please enter a valid phone number")
    .max(13, "Please enter a valid phone number")
    .nullable(),
});

export default function AddInsuranceCompany(props) {
  const [values, setValues] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [errors, setErrors] = useState([]);
  const [visible, setVisible] = useState(false);
  const [contactPersonsExtras, setContactPersonsExtras] = useState({
    search: "",
    page: 1,
    limit: 10,
  });
  const history = useHistory();
  const { data: contactPersonsData } = useQuery(GET_CONTACT_PERSONS, {
    variables: contactPersonsExtras,
  });

  const validateField = async (field, value) => {
    await Yup.reach(companySchema, field)
      .validate(value)
      .then(() => {
        const uiErrors = { ...validationErrors };
        delete uiErrors[field];
        setValidationErrors(uiErrors);
      })
      .catch((error) => {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: error?.message,
        }));
      });
  };

  const handleOnContactSearch = (e) => {
    setContactPersonsExtras({
      ...contactPersonsExtras,
      search: e.target.value,
    });
  };
  const handleOnContactChange = async (e, { value }) => {
    setErrors([]);
    setValues({ ...values, contactPerson: value });
    await validateField("contactPerson", value);
  };

  const onPhoneNumberChange = async (value) => {
    setErrors([]);
    setValues({ ...values, mobileNumber: "+" + value });
    await validateField("mobileNumber", value);
  };
  const onTelephoneNumberChange = async (value) => {
    setErrors([]);
    setValues({ ...values, telephoneNumber: "+" + value });
    await validateField("telephoneNumber", value);
  };
  const handleChange = async ({ target }) => {
    setErrors([]);
    if (!target?.name) return;
    const { name, value } = target;

    setValues((prev) => ({ ...prev, [name]: value }));
    await validateField(name, value);
  };
  const [addInsuranceCompany, { loading }] = useMutation(
    ADD_INSURANCE_COMPANY,
    {
      update(_, result) {
        history.push({
          pathname: "/staff/dashboard/insurance-companies",
        });
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
      variables: values,
    }
  );
  const handleSubmit = (event) => {
    setErrors([]);
    try {
      companySchema
        .validate(values, { abortEarly: false })
        .then(() => {
          //add company
          addInsuranceCompany({
            variables: {
              input: {
                ...values,
                imageUrl,
              },
            },
          });
        })
        .catch((err) => {
          console.log(err);
          const formErrors = err.inner.reduce(
            (errors, item) => ({ ...errors, [item.path]: item.message }),
            {}
          );
          setValidationErrors(formErrors);
        });
    } catch (err) {
      console.log("add company", err);
    }
  };
  return (
    <Container>
      <Grid container padded>
        <Grid.Column>
          <div class="content-wrapper">
            <Header as="h2">
              <Icon name="settings" />
              <Header.Content>
                <a href="/staff/dashboard/insurance-companies">
                  Insurance Companies
                </a>{" "}
                {">"} Add New
                <Header.Subheader>
                  Fill in this form to register an insurance company
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>
      </Grid>
      <Grid container>
        <Grid.Column>
          {visible && !!errors?.length && (
            <Message
              error
              onDismiss={() => {
                setVisible(false);
                setErrors([]);
              }}
            >
              <MessageHeader>System Response</MessageHeader>
              <MessageList>
                {errors.map((error, id) => (
                  <MessageItem key={id}>{error}</MessageItem>
                ))}
              </MessageList>
            </Message>
          )}
          {loading && <Loader active size="medium" />}
        </Grid.Column>
      </Grid>
      <Grid container padded>
        <Grid.Column>
          <Form onSubmit={handleSubmit}>
            <Form.Group widths="equal">
              <Form.Field error={!!validationErrors?.name}>
                <label>Company Name *</label>
                <Form.Input
                  fluid
                  placeholder="Name"
                  name="name"
                  onChange={handleChange}
                  error={validationErrors?.name}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field error={!!validationErrors?.email}>
                <label>Email *</label>
                <Form.Input
                  fluid
                  placeholder="Email"
                  name="email"
                  onChange={handleChange}
                  error={validationErrors?.email}
                />
              </Form.Field>
              <Form.Field error={!!validationErrors?.contactPerson}>
                <label>Contact Person *</label>
                <Form.Input
                  fluid
                  placeholder="Contact Person"
                  name="contactPerson"
                  onChange={handleChange}
                  error={validationErrors?.contactPerson}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field error={!!validationErrors?.mobileNumber}>
                <label>Phone Number *</label>
                <PhoneInput
                  inputExtraProps={{
                    name: "mobileNumber",
                    required: true,
                    autoFocus: true,
                    enableSearch: true,
                  }}
                  style={{ fontWeight: "bold" }}
                  name="mobileNumber"
                  specialLabel=""
                  country={"ke"}
                  onChange={onPhoneNumberChange}
                />
                {!!validationErrors?.mobileNumber && (
                  <div
                    className="ui pointing above prompt label"
                    role="alert"
                    aria-atomic="true"
                  >
                    {validationErrors?.mobileNumber}
                  </div>
                )}
              </Form.Field>
              <Form.Field>
                <PhoneInput
                  inputExtraProps={{
                    name: "telephoneNumber",
                    autoFocus: true,
                    enableSearch: true,
                  }}
                  style={{ fontWeight: "bold" }}
                  name="telephoneNumber"
                  specialLabel="Telephone Number"
                  country={"ke"}
                  onChange={onTelephoneNumberChange}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field error={!!validationErrors?.postalAddress}>
                <label>Postal Address *</label>
                <Form.Input
                  fluid
                  placeholder="Postal Address"
                  name="postalAddress"
                  onChange={handleChange}
                  error={validationErrors?.postalAddress}
                />
              </Form.Field>
              <Form.Field error={!!validationErrors?.physicalAddress}>
                <label>Physical Address *</label>
                <Form.Input
                  fluid
                  placeholder="Physical Address"
                  name="physicalAddress"
                  onChange={handleChange}
                  error={validationErrors?.physicalAddress}
                />
              </Form.Field>
            </Form.Group>

            <Button type="submit" disabled={loading} color="blue">
              Add Company
            </Button>
          </Form>
        </Grid.Column>
      </Grid>
    </Container>
  );
}
