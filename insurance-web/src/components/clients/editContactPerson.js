import React, { useState, useCallback, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalActions,
  Form,
  Button,
  Message,
} from "semantic-ui-react";
import PhoneInput from "react-phone-input-2";
import * as yup from "yup";
import { UPDATE_CONTACT_PERSON, GET_CORPORATE_CLIENT } from "./queries";
import { useMutation } from "@apollo/react-hooks";

const options = [
  { key: "m", text: "Male", value: "Male" },
  { key: "f", text: "Female", value: "Female" },
  { key: "o", text: "Other", value: "Other" },
];

const validationSchema = yup.object().shape({
  name: yup.string().required("Company name is required"),
  email: yup.string().email().required("Tell us about your company"),
  phoneNumber: yup
    .string()
    .required("Please provide a phone number")
    .min(12, "Please enter a valid phone number")
    .max(13, "Please enter a valid phone number"),
  position: yup.string().required("Position is required"),
  gender: yup.string().nullable(),
});

export default function EditContactPerson({
  open,
  onOpen,
  onClose,
  person,
  clientId,
}) {
  const [values, setValues] = useState({
    name: person.name,
    email: person.email,
    position: person.position,
    phoneNumber: person.phoneNumber,
    gender: person.gender,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const onPhoneNumberChange = useCallback(
    async (value) => {
      setErrors({});
      setValues({ ...values, phoneNumber: value });
      await validateField("phoneNumber", value);
    },
    [values]
  );

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

  const getChangedValues = () => {
    let updatedValues = {};
    Object.keys(values).forEach((key) => {
      if (values[key] !== person[key]) {
        updatedValues[key] = values[key];
      }
    });
    return updatedValues;
  };

  const [updateContactPerson, { data, error }] = useMutation(
    UPDATE_CONTACT_PERSON,
    {
      refetchQueries: [{ query: GET_CORPORATE_CLIENT, variables: {id: clientId} }],
      onCompleted: (data) => {
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
      setSuccessMessage("Contact person has been updated successfully");
      setTimeout(() => setSuccessMessage(null), 2000);
      setTimeout(() => onClose(), 3000);
    }
    if (error) {
      setErrorMessage(error?.message);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  }, [data, error]);

  const handleEditContactPerson = async (event) => {
    event.preventDefault();
    setErrors();
    await validationSchema
      .validate(values, { abortEarly: false })
      .then((valid) => {
        setErrors({});
        if (Object.keys(getChangedValues()).length > 0) {
          const updatedContactPerson = getChangedValues();
          if (updatedContactPerson.gender) {
            updatedContactPerson.gender = values.gender[0];
          }
          //   console.log("User", updatedContactPerson);
          updateContactPerson({
            variables: {
              id: person?.id,
              input: updatedContactPerson,
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

  const handleOpen = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setErrors({});
    onOpen();
  };
  return (
    <Modal
      open={open}
      onOpen={handleOpen}
      onClose={onClose}
      trigger={<Button>Edit</Button>}
    >
      <ModalHeader>Edit contact person</ModalHeader>
      <ModalContent>
        {successMessage && <Message positive content={successMessage} />}
        {errorMessage && <Message negative content={errorMessage} />}
        <Form onSubmit={handleEditContactPerson}>
          <Form.Group widths="equal">
            <Form.Input
              label="Full Name"
              type="text"
              name="name"
              defaultValue={values.name}
              onChange={handleChange}
              error={errors?.name}
              required
            />

            <Form.Input
              label="Email"
              type="email"
              name="email"
              required
              defaultValue={values.email}
              onChange={handleChange}
              error={errors?.email}
            />
          </Form.Group>

          <Form.Group widths="equal">
            <Form.Field error={errors?.phoneNumber != null}>
              <PhoneInput
                inputProps={{
                  name: "phoneNumber",
                  required: true,
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

            <Form.Input
              label="Position"
              type="text"
              name="position"
              required
              defaultValue={values.position}
              onChange={handleChange}
              error={errors?.position}
            />

            <Form.Select
              fluid
              label="Gender"
              name="gender"
              options={options}
              value={values.gender}
              onChange={handleChange}
              error={errors?.gender}
            />
          </Form.Group>

          <ModalActions>
            <Button color="black" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button positive type="submit">
              Save
            </Button>
          </ModalActions>
        </Form>
      </ModalContent>
    </Modal>
  );
}
